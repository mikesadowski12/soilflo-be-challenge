import type { ApiDefinition, LoggerDefinition, PostgresDefinition } from  '../../common';

import { envInteger, envLogLevel, envString, LogLevel } from '../../common';

import { Config } from  './base';

class LocalConfig extends Config {
  buildApi(): ApiDefinition {
    return {
      id: envString('APP_ID', 'MY_APPLICATION'),
      port: envString('API_PORT', '8000'),
      bind: envString('API_BIND', '127.0.0.1'),
      url: envString('API_DOMAIN', 'http://127.0.0.1:8000'),
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
}

export { LocalConfig };
