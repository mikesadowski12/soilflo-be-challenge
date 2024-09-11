import type { Application } from '../../common';
import type { Backend } from '../backend';
import { Service } from '../../common';

class Kernel extends Service {
  private backend: Backend;

  constructor(application: Application, backend: Backend) {
    super(application);
    this.backend = backend;
  }
}

export { Kernel };
