import type { Application } from '../../common';
import { Service } from '../../common';

import type { ApiTicket } from '../kernel';

class Backend extends Service {
  constructor(application: Application) {
    super(application);
  }

  /**
   * Save a list of ApiTickets to the database
   */
  async saveTickets(tickets: ApiTicket[]) {
    console.log(tickets);
  }
}

export { Backend };
