import type { Application } from './application';
import type { Health } from './health';
import type { ILogger } from './logger';
import { Task } from '../utils/misc';

type ServiceDetails = object;

class Service {
  protected log: ILogger;
  protected health: Health;
  private _tasks: Array<Task>

  constructor(application: Application, details?: ServiceDetails) {
    application.add(this);
    const serviceInfo = { name: this.constructor.name, ...details };
    this.log = application.logger.create(serviceInfo);
    this.health = application.health;
    this._tasks = [];
  }

  /**
   * Call start() for all the Tasks in _tasks to start the service
   */
  async start() {
    await Promise.all(this._tasks.map((task) => task.start()));
  }

  /**
   * Call stop() for all the Tasks in _tasks to stop the service
   */
  async stop() {
    await Promise.all(this._tasks.map((task) => task.stop()));
  }

  /**
   * Push a Task (a function) to the _tasks array
   * These function will be executed when the service starts
   */
  _createTask(func: Function, name?: string) { // eslint-disable-line @typescript-eslint/no-unsafe-function-type
    this._tasks.push(new Task(func.bind(this), name || func.name, this.log));
  }
}

export { Service };
