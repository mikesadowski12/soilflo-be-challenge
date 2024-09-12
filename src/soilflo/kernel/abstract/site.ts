import { ApiError, ILogger } from '../../../common';

import type { Kernel } from '../kernel';

class Site {
  protected kernel: Kernel;
  protected log: ILogger;

  constructor(kernel: Kernel, logger: ILogger) {
    this.kernel = kernel;
    this.log = logger;
    if (!this.log) {
      throw new ApiError({}, 'Must provide logger to construct Site');
    }
  }
}

class ApiSite extends Site {
  private id: number;
  private name: string;

  constructor(kernel: Kernel, logger: ILogger, id: number, name: string) {
    super(kernel, logger);
    this.log.debug({
      id,
      name,
    }, 'Building Site object from data');
    this.id = id;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}

export { ApiSite };
