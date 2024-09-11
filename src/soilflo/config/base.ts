import { BaseConfig, ApiDefinition, LoggerDefinition, PostgresDefinition, LogLevel } from  '../../common';

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
}

export { Config };
