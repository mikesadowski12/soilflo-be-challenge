import { ApiError, ILogger } from '../../../common';

import type { Kernel } from '../kernel';
import type { ApiSite } from './site';

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
  private license?: string;
  private site?: ApiSite;

  constructor(kernel: Kernel, logger: ILogger, id: number, license?: string, site?: ApiSite) {
    super(kernel, logger);
    this.log.debug({ id }, 'Building Truck object from data');
    this.id = id;
    this.license = license;
    this.site = site;
  }

  getId(): number {
    return this.id;
  }

  getSite(): ApiSite | undefined {
    return this.site;
  }

  getLicense(): string | undefined {
    return this.license;
  }
}

export { ApiTruck };
