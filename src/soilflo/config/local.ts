import type { ApiDefinition, LoggerDefinition, PostgresDefinition, SwaggerDefinition } from  '../../common';

import { envInteger, envLogLevel, envString, LogLevel } from '../../common';

import { Config } from  './base';

class LocalConfig extends Config {
  buildApi(): ApiDefinition {
    return {
      id: envString('APP_ID', 'MY_APPLICATION'),
      port: envString('API_PORT', '8000'),
      bind: envString('API_BIND', '127.0.0.1'),
      url: envString('API_DOMAIN', 'http://127.0.0.1:8000'),
      deployment: envString('DEPLOYMENT', 'local'),
    };
  }

  buildLogger(): LoggerDefinition {
    return {
      level: envLogLevel('LOG_LEVEL', LogLevel.INFO),
    };
  }

  buildPostgres(): PostgresDefinition {
    return {
      host: envString('POSTGRES_HOST', 'localhost'),
      port: envInteger('POSTGRES_PORT', 5432),
      username: envString('POSTGRES_USERNAME', 'myuser'),
      password: envString('POSTGRES_PASSWORD', 'mypassword'),
      db: envString('POSTGRES_DB', 'mydatabase'),
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

export { LocalConfig };
