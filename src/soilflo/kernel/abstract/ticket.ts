import { ApiError, ILogger } from '../../../common';

import type { Kernel } from '../kernel';
import type { ApiTruck } from './truck';

class Ticket {
  protected kernel: Kernel;
  protected log: ILogger;

  constructor(kernel: Kernel, logger: ILogger) {
    this.kernel = kernel;
    this.log = logger;
    if (!this.log) {
      throw new ApiError({}, 'Must provide logger to construct Ticket');
    }
  }
}

class ApiTicket extends Ticket {
  private truck: ApiTruck;
  private dispatchTime: string;
  private material: string;
  private number: number|undefined;

  constructor(kernel: Kernel, logger: ILogger, truck: ApiTruck, dispatchTime: string, material: string, number?: number) {
    super(kernel, logger);
    this.log.debug({
      truckId: truck.getId(),
      dispatchTime,
      material,
    }, 'Building Ticket object from data');
    this.truck = truck;
    this.dispatchTime = dispatchTime;
    this.material = material;
    this.number = number;
  }

  getDispatchTime(): string {
    return this.dispatchTime;
  }

  /**
   * Serialize the Ticket into a format that can be saved into a database
   */
  serialize() {
    return {
      truckId: this.truck.getId(),
      dispatchTime: this.dispatchTime,
      material: this.material,
    };
  }

  /**
   * Serialize the Ticket into a format that can be returned to client
   */
  present() {
    const site = this.truck.getSite();
    if (!site) {
      throw new ApiError({}, 'Site must be defined in order to present payload');
    }

    const license = this.truck.getLicense();
    if (!license) {
      throw new ApiError({}, 'Truck license plate must be defined in order to present payload');
    }

    if (!this.number) {
      throw new ApiError({}, 'Ticket number must be defined in order to present payload');
    }

    return {
      siteName: site.getName(),
      truckLicensePlate: license,
      number: this.number,
      dispatchTime: this.dispatchTime,
      material: this.material,
    };
  }
}

export { ApiTicket };
