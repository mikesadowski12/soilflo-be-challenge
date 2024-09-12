import {
  EmptyResponse,
  HttpServer,
  type Application,
  type HttpResponse,
  type RequestOptions,
  BadRequestError,
  ConflictError,
  JsonResponse,
} from '../../common';
import { type Kernel, type ApiTicket, validateDispatchTimeUniqueness } from '../kernel';
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
  }

  $tickets(handler: (_: RequestOptions & { truckId: number, tickets: ApiTicket[] }) => Promise<HttpResponse>) {
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

  async createTickets({ logger, tickets, truckId }: RequestOptions & { truckId: number, tickets: ApiTicket[] }): Promise<HttpResponse> {
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
}

export { Api };
