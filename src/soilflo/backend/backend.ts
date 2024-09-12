import type { Application } from '../../common';
import { Service } from '../../common';

import type { Postgres, TicketResult } from './databases';
import { ApiTicket, ApiQuery } from '../kernel';

class Backend extends Service {
  private postgres: Postgres;

  constructor(application: Application, postgres: Postgres) {
    super(application);
    this.postgres = postgres;
  }

  /**
   * Save a list of ApiTickets to the database for a single truck
   */
  async saveTickets(truckId: number, tickets: ApiTicket[]): Promise<void> {
    return this.postgres.saveTickets(truckId, tickets.map((ticket) => ticket.serialize()));
  }

  /**
   * Retrieve a list of Tickets from the database
   */
  async findTickets(query: ApiQuery): Promise<TicketResult[]> {
    return this.postgres.findTickets(query.serialize());
  }
}

export { Backend };
