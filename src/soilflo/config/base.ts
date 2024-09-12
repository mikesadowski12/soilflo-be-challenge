import { BaseConfig, ApiDefinition, LoggerDefinition, PostgresDefinition, LogLevel, SwaggerDefinition } from  '../../common';

class Config extends BaseConfig {
  constructor() {
    super();
    this.postgres = this.buildPostgres();
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

  buildPostgres(): PostgresDefinition {
    return {
      host: 'localhost',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      db: 'mydatabase',
    };
  }

  buildSwagger(): SwaggerDefinition {
    return {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'SoilFlo API',
          version: '1.0.0',
          description: 'API Documentation for SoilFlo API',
        },
      },
      apis: ['./src/soilflo/api/*.ts'],
    };
  }
}

export { Config };
