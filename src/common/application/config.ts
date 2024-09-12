import { LogLevel } from '../internals/consts';

type ApiDefinition = {
  id: string;
  port: string;
  bind: string;
  url: string;
  deployment: string;
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

type SwaggerDefinition = {
  definition: {
    openapi: string,
    info: {
      title: string,
      version: string,
      description: string,
    },
  },
  apis: string[],
}

class BaseConfig {
  protected api: ApiDefinition;
  protected logger: LoggerDefinition;
  protected postgres?: PostgresDefinition;
  protected swagger?: SwaggerDefinition;

  constructor() {
    this.api = this.buildApi();
    this.logger = this.buildLogger();
    this.swagger = this.buildSwagger();

    // Optional properties
    this.postgres = { host: '', port: 0, username: '', password: '', db: '' };
  }

  buildApi(): ApiDefinition {
    return {
      id: 'MY_APPLICATION',
      port: '8000',
      bind: '127.0.0.1',
      url: 'http://127.0.0.1:8000',
      deployment: 'local',
    };
  }

  buildLogger(): LoggerDefinition {
    return {
      level: LogLevel.INFO,
    };
  }

  buildSwagger(): SwaggerDefinition {
    return {
      definition: {
        openapi: '',
        info: {
          title: '',
          version: '',
          description: '',
        },
      },
      apis: [],
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

  getSwagger(): SwaggerDefinition | undefined{
    return this.swagger;
  }
}

export {
  BaseConfig,
  ApiDefinition,
  LoggerDefinition,
  PostgresDefinition,
  SwaggerDefinition,
};
