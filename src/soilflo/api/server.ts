import {
  EmptyResponse,
  HttpServer,
  type Application,
  type HttpResponse,
  type RequestOptions,
  BadRequestError,
  ConflictError,
  JsonResponse,
  DateRange,
} from '../../common';
import { type Kernel, type ApiTicket, type ApiQuery, validateDispatchTimeUniqueness } from '../kernel';
import type { Backend } from '../backend';

class Api extends HttpServer {
  private application: Application;
  private backend: Backend;
  private kernel: Kernel;

  constructor(application: Application, backend: Backend, kernel: Kernel) {
    const { port, bind } = application.config.getApi();
    super(application, { host: bind, port });
    this.application = application;
    this.backend = backend;
    this.kernel = kernel;
  }

  definition() {
    this.route('POST', '/api/v1/trucks/:truckId/tickets', this.$tickets(this.createTickets));
    this.route('GET', '/api/v1/tickets', this.$query(this.findTickets));
  }

  private $tickets(handler: (_: RequestOptions & { truckId: number, tickets: ApiTicket[] }) => Promise<HttpResponse>) {
    const wrapped = async (request: RequestOptions) => {
      const logger = this.log;
      let truckId;
      let rawTickets;

      try {
        const { body, params } = request;
        if (params && params.truckId) {
          truckId = params.truckId;
        }
        if (body && body.tickets) {
          rawTickets = body.tickets;
        }

        if (!truckId) {
          throw new BadRequestError({}, 'Truck ID was not provided');
        }

        if (!rawTickets || rawTickets.length < 1) {
          throw new BadRequestError({}, 'List of tickets was not provided');
        }

        const truck = await this.kernel.getTruckHandler(logger, truckId);
        const tickets = await Promise.all(
          rawTickets.map(({ material, dispatchTime }) => this.kernel.getTicketHandler(logger, truck, dispatchTime, material))
        );

        /**
         * This validation is not required, the transaction will abort
         * if a duplicate dispatch time is entered into Postgres.
         * However, if we can catch an error here and save a DB call,
         * I think its better to do so. We are trading a few CPU cycles
         * for a DB call which I think is more than worth it.
         */
        validateDispatchTimeUniqueness(tickets);

        return handler.call(this, {
          ...request,
          logger,
          truckId: parseInt(truckId),
          tickets,
        });
      } catch (error) {
        if (error instanceof BadRequestError) {
          logger.error({ error }, 'Missing/invalid required properties while building ticket handlers');
          return new JsonResponse({ error: error.message }, { status: 400 });
        }

        if (error instanceof ConflictError) {
          logger.error({ error }, 'Dispatch times are not unique for the creation of the requested tickets');
          return new JsonResponse({ error: error.message }, { status: 409 });
        }

        logger.error({ error }, 'Error in tickets decorator');
        return new EmptyResponse({ status: 500 });
      }
    }

    return wrapped;
  }

  private async createTickets({ logger, tickets, truckId }: RequestOptions & { truckId: number, tickets: ApiTicket[] }): Promise<HttpResponse> {
    try {
      await this.backend.saveTickets(truckId, tickets);
      return new EmptyResponse();
    } catch (error) {
      if (error instanceof ConflictError) {
        logger.error({ error }, 'Dispatch times are not unique for the creation of the requested tickets');
        return new JsonResponse({ error: error.message }, { status: 409 });
      }

      logger.error({ error }, 'Error in Create tickets handler');
      return new EmptyResponse({ status: 500 });
    }
  }

  private $query(handler: (_: RequestOptions & { ticketQuery: ApiQuery }) => Promise<HttpResponse>) {
    const wrapped = async (request: RequestOptions & { ticketQuery: ApiQuery }) => {
      const logger = this.log;
      let siteId = undefined;
      const dateRange: DateRange = {
        startDate: undefined,
        endDate: undefined,
      };
      let pageNumber = undefined;
      let pageSize = undefined;

      try {
        const { query } = request;
        if (query && query.siteId) {
          siteId = parseInt(query.siteId);
          if (isNaN(siteId)) {
            throw new BadRequestError({}, '\'siteId\' query parameter must be an integer');
          }
        }

        if (query && query.startDate) {
          dateRange.startDate = new Date(query.startDate);
          if (isNaN(dateRange.startDate.getTime())) {
            throw new BadRequestError({}, '\'startDate\' query parameter must be a valid date');
          }
        }

        if (query && query.endDate) {
          dateRange.endDate = new Date(query.endDate);
          if (isNaN(dateRange.endDate.getTime())) {
            throw new BadRequestError({}, '\'endDate\' query parameter must be a valid date');
          }
        }

        if (query && query.pageNumber) {
          pageNumber = parseInt(query.pageNumber);
          if (isNaN(pageNumber)) {
            throw new BadRequestError({}, '\'pageNumber\' query parameter must be an integer');
          }
        }

        if (query && query.pageSize) {
          pageSize = parseInt(query.pageSize);
          if (isNaN(pageSize)) {
            throw new BadRequestError({}, '\'pageSize\' query parameter must be an integer');
          }
        }

        if ((pageNumber && !pageSize) || (!pageNumber && pageSize)) {
          throw new BadRequestError({}, 'Both \'pageNumber\' AND \'pageSize\' query parameters must be present to use pagination');
        }

        const ticketQuery = await this.kernel.getQueryHandler(logger, siteId, dateRange, pageNumber, pageSize);

        return handler.call(this, {
          ...request,
          logger,
          ticketQuery,
        });
      } catch (error) {
        if (error instanceof BadRequestError) {
          logger.error({ error }, 'Missing/invalid required properties while building query handler');
          return new JsonResponse({ error: error.message }, { status: 400 });
        }

        logger.error({ error }, 'Error in query decorator');
        return new EmptyResponse({ status: 500 });
      }
    }

    return wrapped;
  }

  private async findTickets({ logger, ticketQuery }: RequestOptions & { ticketQuery: ApiQuery }): Promise<HttpResponse> {
    try {
      // TODO: paginate the results perhaps??
      const tickets = await this.backend.findTickets(ticketQuery);
      return new EmptyResponse();
    } catch (error) {
      logger.error({ error }, 'Error in Find tickets handler');
      return new EmptyResponse({ status: 500 });
    }
  }
}

export { Api };
