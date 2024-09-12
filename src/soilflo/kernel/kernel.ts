import type { Application, DateRange } from '../../common';
import type { Backend } from '../backend';
import { Service, ILogger } from '../../common';
import { ApiTruck, ApiTicket, ApiQuery, ApiSite } from './abstract';

class Kernel extends Service {
  private backend: Backend;

  constructor(application: Application, backend: Backend) {
    super(application);
    this.backend = backend;
  }

  /**
   * Save a list of ApiTickets to the database for a single truck
   */
  async saveTickets(truckId: number, tickets: ApiTicket[]): Promise<void> {
    return this.backend.saveTickets(truckId, tickets);
  }

  /**
   * Retrieve a list of Tickets from the database
   */
  async findTickets(query: ApiQuery): Promise<ApiTicket[]> {
    const tickets = await this.backend.findTickets(query);
    return tickets.map((ticket) =>
      this._unserializeTicket(
        query.getLogger(),
        this._unserializeTruck(
          query.getLogger(),
          ticket.truck.id || -1,
          ticket.truck.license || undefined,
          this._unserializeSite(
            query.getLogger(),
            ticket.site.id || -1,
            ticket.site.name || '',
          ),
        ),
        ticket.dispatchTime.toISOString(),
        ticket.material,
        ticket.number ? parseInt(ticket.number) : undefined,
      ),
    );
  }

  private _unserializeTruck(logger: ILogger, id: number, license?: string, site?: ApiSite): ApiTruck {
    return new ApiTruck(this, logger, id, license, site);
  }

  async getTruckHandler(logger: ILogger, id: number, license?: string): Promise<ApiTruck> {
    return this._unserializeTruck(logger, id, license);
  }

  private _unserializeTicket(logger: ILogger, truck: ApiTruck, dispatchTime: string, material: string, number?: number): ApiTicket {
    return new ApiTicket(this, logger, truck, dispatchTime, material, number);
  }

  async getTicketHandler(logger: ILogger, truck: ApiTruck, dispatchTime: string, material: string, number?: number): Promise<ApiTicket> {
    return this._unserializeTicket(logger, truck, dispatchTime, material, number);
  }

  private _unserializeQuery(logger: ILogger, siteId?: number, dateRange?: DateRange, pageNumber?: number, pageSize?: number): ApiQuery {
    return new ApiQuery(this, logger, siteId, dateRange, pageNumber, pageSize);
  }

  async getQueryHandler(logger: ILogger, siteId?: number, dateRange?: DateRange, pageNumber?: number, pageSize?: number): Promise<ApiQuery> {
    return this._unserializeQuery(logger, siteId, dateRange, pageNumber, pageSize);
  }

  private _unserializeSite(logger: ILogger, id: number, name: string): ApiSite {
    return new ApiSite(this, logger, id, name);
  }

  async getSiteHandler(logger: ILogger, id: number, name: string): Promise<ApiSite> {
    return this._unserializeSite(logger, id, name);
  }
}

export { Kernel };
