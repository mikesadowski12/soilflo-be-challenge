import type { Application, DateRange } from '../../common';
import type { Backend } from '../backend';
import { Service, ILogger } from '../../common';
import { ApiTruck, ApiTicket, ApiQuery } from './abstract';

class Kernel extends Service {
  private backend: Backend;

  constructor(application: Application, backend: Backend) {
    super(application);
    this.backend = backend;
  }

  private async _unserializeTruck(logger: ILogger, id: string): Promise<ApiTruck> {
    return new ApiTruck(this, logger, id);
  }

  async getTruckHandler(logger: ILogger, id: string): Promise<ApiTruck> {
    return this._unserializeTruck(logger, id);
  }

  private async _unserializeTicket(logger: ILogger, truck: ApiTruck, dispatchTime: string, material: string): Promise<ApiTicket> {
    return new ApiTicket(this, logger, truck, dispatchTime, material);
  }

  async getTicketHandler(logger: ILogger, truck: ApiTruck, dispatchTime: string, material: string): Promise<ApiTicket> {
    return this._unserializeTicket(logger, truck, dispatchTime, material);
  }

  private async _unserializeQuery(logger: ILogger, siteId?: number, dateRange?: DateRange, pageNumber?: number, pageSize?: number): Promise<ApiQuery> {
    return new ApiQuery(this, logger, siteId, dateRange, pageNumber, pageSize);
  }

  async getQueryHandler(logger: ILogger, siteId?: number, dateRange?: DateRange, pageNumber?: number, pageSize?: number): Promise<ApiQuery> {
    return this._unserializeQuery(logger, siteId, dateRange, pageNumber, pageSize);
  }
}

export { Kernel };
