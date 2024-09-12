import path from 'path';

import { UniqueConstraintError } from 'sequelize';

import {
  PostgresConnector,
  type Application,
  readJsonFile,
  ConflictError,
} from '../../../../common';

import {
  Site,
  SiteOptions,
  SiteSchema,
  Truck,
  TruckOptions,
  TruckSchema,
  Ticket,
  TicketOptions,
  TicketSchema,
  associate,
} from './models';

class Postgres extends PostgresConnector {
  constructor(application: Application) {
    super(application);
  }

  async saveTickets(tickets: { truckId: number, dispatchTime: string, material: string }[]) {
    const transaction = await this.client.transaction();
    try {
      // TODO:
      // need to fix this query to count the ticket number for a SITE.
      // index foreign keys
      // join tickets table to truck table on truckId to get the siteId
      // get the max count of ticket number for that siteId
      // stick the new count onto each of the objects before saving


      // const currentNumber = await Ticket.max('number', { transaction }) as number || 0;
      // const dataWithCount = tickets.map((ticket, i) => ({
      //   ...ticket,
      //   // number: currentNumber + i + 1,
      // }));
      // console.log(dataWithCount);
      await Ticket.bulkCreate(tickets, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if (error instanceof UniqueConstraintError) {
        throw new ConflictError({}, 'Dispatch time for a truck must be unique');
      }
      throw error;
    }
  }

  /**
   * Create and populate the database tables with the data provided from the JSON files
   * Done in a transaction incase of an error (abort all)
   */
  async init() {
    const transaction = await this.client.transaction();
    try {
      await Promise.all([
        this._initializeSiteModel(),
        this._initializeTruckModel(),
        this._initializeTicketModel(),
      ]);
      associate();
      await this._createTables();

      const [sites, trucks] = await Promise.all([
        this._loadSitesData(),
        this._loadTrucksData(),
      ]);
      await Site.bulkCreate(sites, {});
      await Truck.bulkCreate(trucks, {});
      await transaction.commit();
    } catch (error) {
      this.log.error({ error }, 'Aborting Postgres initialization');
      await transaction.rollback();
      throw error;
    }
  }

  private async _initializeSiteModel() {
    Site.init({ ...SiteSchema }, { sequelize: this.client, tableName: 'sites', ...SiteOptions });
  }

  private async _initializeTruckModel() {
    Truck.init({ ...TruckSchema }, { sequelize: this.client, tableName: 'trucks', ...TruckOptions });
  }

  private async _initializeTicketModel() {
    Ticket.init({ ...TicketSchema }, { sequelize: this.client, tableName: 'tickets', ...TicketOptions });
  }

  /**
   * Create database tables based on the models
   * NOTE: drops previous tables and re-creates them (data will be lost)
   */
  private async _createTables() {
    return this.client.sync({ force: true });
  }

  private async _loadJson(filePath: string) {
    try {
      const data = await readJsonFile(filePath);
      return data;
    } catch (error) {
      this.log.error({ filePath, error }, 'Unable to load data from JSON file');
      return '';
    }
  }

  /**
   * Load the sites data from the json file
   */
  private async _loadSitesData() {
    return this._loadJson(path.join(__dirname, '../../../../../data/SitesJSONData.json'));
  }

  /**
   * Load the trucks data from the json file
   */
  private async _loadTrucksData() {
    return this._loadJson(path.join(__dirname, '../../../../../data/TrucksJSONData.json'));
  }
}

export { Postgres };
