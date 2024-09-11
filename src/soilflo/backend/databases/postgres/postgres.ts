import {
  PostgresConnector,
  type Application,
} from '../../../../common';

import {
} from './models';

class Postgres extends PostgresConnector {
  constructor(application: Application) {
    super(application);
  }

  async saveTickets(tickets: { truckId: number, dispatchTime: string, material: string }[]) {
    console.log(tickets);
  }

  /**
   * Create and populate the database tables with the data provided from the JSON files
   */
  async init() {

  }
}

export { Postgres };
