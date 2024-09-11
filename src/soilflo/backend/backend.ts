import type { Application } from '../../common';
import { Service } from '../../common';

import type { Postgres } from './databases';
import type { ApiTicket } from '../kernel';

class Backend extends Service {
  private postgres: Postgres;

  constructor(application: Application, postgres: Postgres) {
    super(application);
    this.postgres = postgres;
  }

  /**
   * Save a list of ApiTickets to the database
   */
  async saveTickets(tickets: ApiTicket[]) {
    return this.postgres.saveTickets(tickets.map((ticket) => ticket.serialize()));
  }
}

export { Backend };
