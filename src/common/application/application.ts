import type { BaseConfig } from './config';
import type { Logger, ILogger } from './logger';
import type { Health } from './health';
import type { Service } from './service';

class Application {
  public config: BaseConfig;
  public logger: Logger;
  public health: Health;
  private log: ILogger;
  private services: Array<Service>;

  constructor(config: BaseConfig, logger: Logger, health: Health) {
    this.config = config;
    this.health = health;
    this.logger = logger;

    const serviceInfo = { name: this.constructor.name };
    this.log = this.logger.create(serviceInfo)
    this.services = [];
  }

  /**
   * Add a service to the application (keeping intended execution order)
   */
  add(service: Service): void {
    this.services.push(service)
  }

  /**
   * Start the application
   * We start services one by one in the intended order
  */
  async start(): Promise<void> {
    for (const service of this.services) {
      await service.start();
    }
  }

  /**
   * Stop the application
   * We stop services one by one in the reverse intended starting order
  */
  async stop(): Promise<void> {
    this.services.reverse();
    for (const service of this.services) {
      await service.stop();
    }
  }

  /**
   * Wait for application process to terminate in some fashion
   */
  async _waitForApplicationClose(): Promise<void> {
    return (new Promise((resolve) => {
      process.once('uncaughtException', (error) => {
        this.log.error({ error }, 'uncaughtException received');
      });
      process.once('unhandledRejection', (error) => {
        this.log.error({ error }, 'unhandledRejection received');
      });
      process.once('SIGTERM', () => {
        this.log.info({}, 'SIGTERM received');
        resolve();
      });
    }));
  }

  async run() {
    await this.start();
    await this._waitForApplicationClose();
    await this.stop();
  }
}

export { Application }
