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
  private id: number;
  private license: string | undefined;

  constructor(kernel: Kernel, logger: ILogger, id: number, license?: string) {
    super(kernel, logger);
    this.log.debug({ id }, 'Building Truck object from data');
    this.id = id;
    this.license = license;
  }

  getId(): number {
    return this.id;
  }
}

export { ApiTruck };
