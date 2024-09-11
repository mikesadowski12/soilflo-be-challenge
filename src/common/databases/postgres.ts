import { Sequelize } from 'sequelize';

import {
  Service,
  type Application,
  type PostgresDefinition,
} from '../application';
import { AbstractMethod, ApiError } from '../internals';

class PostgresConnector extends Service {
  private config: PostgresDefinition;
  protected client: Sequelize;

  constructor(application: Application) {
    super(application);
    const config = application.config.getPostgres();
    if (!config) {
      throw new ApiError({}, 'Postgres configuration not provided to PostgresConnector');
    }
    this.config = config;

    this.client = new Sequelize(this.config.db, this.config.username, this.config.password, {
      host: this.config.host,
      port: this.config.port,
      dialect: 'postgres',
      logging: false,
    });
  }

  /**
   * Initialize the database
   * (create tables, build models, load data, etc)
   */
  async init() {
    throw new AbstractMethod();
  }

  /**
   * Connect to the database
   */
  async start() {
    try {
      await this.client.authenticate();
      this.log.info({}, 'Connection to Postgres has been established successfully');
      await this.init();
      this.log.info({}, 'Postgres has been initialized successfully');
    } catch (err) {
      this.log.error('Unable to connect to Postgres:', err);
    }
  }

  /**
   * Disconnect from the database
   */
  async stop() {
    try {
      await this.client.close();
      this.log.info({}, 'Connection to Postgres has been closed successfully');
    } catch (error) {
      this.log.error({ error }, 'Unable to disconnect from Postgres');
    }
  }
}

export { PostgresConnector }
