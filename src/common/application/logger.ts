import type { BaseConfig } from './config';

type ServiceInfo = {
  name: string;
}

interface ILogger {
  info: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  error: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  warn: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  debug: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  trace: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
}

class Logger {
  private config: BaseConfig;
  private _log: ILogger

  constructor(config: BaseConfig, applicationName: string) {
    this.config = config;
    this._log = {
      info: console.log,
      error: console.error,
      warn: console.warn,
      debug: console.debug,
      trace: console.trace,
    }
    // TODO: create log object with info, error, warning log functions.
  }

  /**
   * Initialize the logging function
   */
  create(serviceInfo: ServiceInfo): ILogger {
    return this._log
  }
}

export { Logger, ServiceInfo, ILogger };
