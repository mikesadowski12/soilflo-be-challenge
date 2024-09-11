import type { Application } from '../../common';
import type { Backend } from '../backend';
import { Service, ILogger } from '../../common';
import { ApiTruck, ApiTicket } from './abstract';

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
}

export { Kernel };
