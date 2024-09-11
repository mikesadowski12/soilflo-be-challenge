import { promises as fs } from 'fs';

import type { ILogger } from '../application/logger';
import { SECOND } from '../internals/consts';

class Task {
  private _func: Function // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  private _name?: string
  private _log?: ILogger
  private _timeout: null | NodeJS.Timeout;
  private running: null | boolean;

  constructor(func: Function, name?: string, log?: ILogger) { // eslint-disable-line @typescript-eslint/no-unsafe-function-type
    this._func = func;
    this._name = name;
    this._log = log;

    this._timeout = null;
    this.running = null;
  }

  _schedule(delay: number) {
    if (this.running) {
      this._timeout = setTimeout(this._wrapper.bind(this), delay);
    }
  }

  async _wrapper() {
    try {
      this._timeout = null;
      const delay = await this._func();

      if (typeof delay === 'number') {
        this._schedule(delay);
      }
    } catch (error) {
      if (this._log) {
        this._log.error({ error });
      }

      if (this.running) {
        this._schedule(1 * SECOND);
      }
    }
  }

  async start() {
    this.running = true;
    this._schedule(0);
  }

  async stop() {
    this.running = false;

    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }
}

async function readJsonFile(path: string): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const data = await fs.readFile(path, 'utf-8');
  return JSON.parse(data);
}

export {
  Task,
  readJsonFile,
}