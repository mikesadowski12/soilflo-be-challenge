import path from 'path';

import { Sequelize, UniqueConstraintError } from 'sequelize';

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

  /**
   * Use truckId to find the highest number of a ticket (current ticket number) for a site
   * - Left joins all 3 tables together to filter only the tickets for a site
   * - Fetches maximum number from the tickets for a site
   * - 'number' column on tickets table is indexed to improve query performance
   */
  private async _getTicketNumberForSite(truckId: number): Promise<number> {
    try {
      const result = await Ticket.findOne({
        include: [
          {
            model: Truck,
            as: 'truck',
            where: { id: truckId },
            attributes: [],
            include: [
              {
                model: Site,
                as: 'site',
                attributes: [],
              },
            ],
          },
        ],
        attributes: [[Sequelize.fn('MAX', Sequelize.col('Ticket.number')), 'number']],
        raw: true, // use raw result to prevent group by error
      });
      return result && result.number ? parseInt(result.number) : 0;
    } catch (error) {
      this.log.error({ truckId, error }, 'Error fetching max ticket number for site');
      throw error;
    }
  }

  /**
   * Save a list of Tickets to the database for a single truck
   */
  async saveTickets(truckId: number, tickets: { truckId: number, dispatchTime: string, material: string }[]) {
    const transaction = await this.client.transaction();
    try {
      const currentTicketNumber = await this._getTicketNumberForSite(truckId);
      await Ticket.bulkCreate(tickets.map((ticket, i) => ({
        ...ticket,
        number: currentTicketNumber + i + 1,
      })), { transaction });
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
  protected async init() {
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
