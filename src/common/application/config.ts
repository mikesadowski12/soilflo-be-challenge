import { LogLevel } from '../internals/consts';

type ApiDefinition = {
  id: string;
  port: string;
  bind: string;
  url: string;
}

type LoggerDefinition = {
  level: LogLevel;
}

type PostgresDefinition = {
  host: string,
  port: number,
  username: string,
  password: string,
  db: string,
}

class BaseConfig {
  protected api: ApiDefinition;
  protected logger: LoggerDefinition;
  protected postgres?: PostgresDefinition;

  constructor() {
    this.api = this.buildApi();
    this.logger = this.buildLogger();

    // Optional properties
    this.postgres = { host: '', port: 0, username: '', password: '', db: '' };
  }

  buildApi(): ApiDefinition {
    return {
      id: 'MY_APPLICATION',
      port: '8000',
      bind: '127.0.0.1',
      url: 'http://127.0.0.1:8000',
    };
  }

  buildLogger(): LoggerDefinition {
    return {
      level: LogLevel.INFO,
    };
  }

  getApi(): ApiDefinition {
    return this.api;
  }

  getLogger(): LoggerDefinition {
    return this.logger;
  }

  getPostgres(): PostgresDefinition | undefined {
    return this.postgres;
  }
}

export {
  BaseConfig,
  ApiDefinition,
  LoggerDefinition,
  PostgresDefinition,
};
