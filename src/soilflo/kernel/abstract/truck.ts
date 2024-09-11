import { ApiError, ILogger } from '../../../common';

import type { Kernel } from '../kernel';

class Truck {
  protected kernel: Kernel;
  protected log: ILogger;

  constructor(kernel: Kernel, logger: ILogger) {
    this.kernel = kernel;
    this.log = logger;
    if (!this.log) {
      throw new ApiError({}, 'Must provide logger to construct Truck');
    }
  }
}

class ApiTruck extends Truck {
  private id: string;

  constructor(kernel: Kernel, logger: ILogger, id: string) {
    super(kernel, logger);
    this.log.debug({ id }, 'Building Truck object from data');
    this.id = id;
  }

  getId(): number {
    return parseInt(this.id);
  }
}

export { ApiTruck };
