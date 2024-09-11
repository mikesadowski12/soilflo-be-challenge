import type { BaseConfig } from './config';
import type { Logger, ILogger } from './logger';

class Health {
  private config: BaseConfig;
  private log: ILogger;

  constructor(config: BaseConfig, logger:Logger) {
    this.config = config;
    const serviceInfo = { name: this.constructor.name };
    this.log = logger.create(serviceInfo)
  }
}

export { Health };
