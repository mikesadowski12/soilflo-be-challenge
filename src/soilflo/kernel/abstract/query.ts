import { ApiError, ILogger, DateRange } from '../../../common';

import type { Kernel } from '../kernel';

class Query {
  protected kernel: Kernel;
  protected log: ILogger;

  constructor(kernel: Kernel, logger: ILogger) {
    this.kernel = kernel;
    this.log = logger;
    if (!this.log) {
      throw new ApiError({}, 'Must provide logger to construct Query');
    }
  }
}

class ApiQuery extends Query {
  private siteId?: number;
  private dateRange?: DateRange;
  private pageNumber?: number;
  private pageSize?: number;

  constructor(kernel: Kernel, logger: ILogger, siteId?: number, dateRange?: DateRange, pageNumber?: number, pageSize?: number) {
    super(kernel, logger);
    this.log.debug({
      siteId,
      dateRange,
    }, 'Building Query object from data');
    this.siteId = siteId;
    this.dateRange = dateRange;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }

  /**
   * Serialize the Query into a format that can used to query the database
   * (also sets default values to uninitialized filter values)
   */
  serialize() {
    const siteId = this.siteId;
    const startDate = this.dateRange?.startDate || new Date(1900, 0, 1); // default startDate is January 1st, 1900
    const endDate = this.dateRange?.endDate || new Date(); // default endDate is now
    const pageNumber = this.pageNumber;
    const pageSize = this.pageSize;
    return {
      siteId,
      startDate,
      endDate,
      pageNumber,
      pageSize,
    };
  }

  getLogger(): ILogger {
    return this.log;
  }
}

export { ApiQuery };
