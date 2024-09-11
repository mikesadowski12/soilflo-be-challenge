import path from 'path';

import {
  PostgresConnector,
  type Application,
  readJsonFile,
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
