import type { Application } from '../../common';
import { Service } from '../../common';

import type { Postgres } from './databases';
import type { ApiTicket, ApiQuery } from '../kernel';

class Backend extends Service {
  private postgres: Postgres;

  constructor(application: Application, postgres: Postgres) {
    super(application);
    this.postgres = postgres;
  }

  /**
   * Save a list of ApiTickets to the database for a single truck
   */
  async saveTickets(truckId: number, tickets: ApiTicket[]) {
    return this.postgres.saveTickets(truckId, tickets.map((ticket) => ticket.serialize()));
  }

  /**
   * Retrieve a list of ApiTickets from the database
   */
  async findTickets(query: ApiQuery) {
    const tickets = await this.postgres.findTickets(query.serialize());
    console.log('findTicketsfindTickets()', tickets);
    return;
  }
}

export { Backend };
