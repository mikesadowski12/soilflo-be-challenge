import type { Application } from '../../common';
import { Service } from '../../common';

class Backend extends Service {
  constructor(application: Application) {
    super(application);
  }
}

export { Backend };
