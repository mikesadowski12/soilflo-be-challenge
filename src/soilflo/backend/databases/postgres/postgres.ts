import path from 'path';

import { Sequelize, UniqueConstraintError, Op } from 'sequelize';

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
  TicketResult,
} from './models';

class Postgres extends PostgresConnector {
  constructor(application: Application) {
    super(application);
  }

  /**
   * Retrieve a list of ApiTickets from the database
   */
  async findTickets(query: { siteId?: number, startDate: Date, endDate: Date, pageNumber?: number, pageSize?: number }): Promise<TicketResult[]> {
    try {
      const {
        siteId,
        startDate,
        endDate,
        pageNumber,
        pageSize,
      } = query;
      const whereClause: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
      let limit: number | undefined;
      let offset: number | undefined;

      whereClause['dispatchTime'] = { [Op.between]: [startDate, endDate] };
      if (siteId) {
        whereClause['$Truck.siteId$'] = siteId;
      }
      if (pageNumber && pageSize) {
        limit = pageSize;
        offset = (pageNumber - 1) * pageSize;
      }

      const tickets = await Ticket.findAll({
        where: whereClause,
        attributes: ['id', 'number', 'dispatchTime', 'material'],
        include: [
          {
            model: Truck,
            as: 'Truck',
            attributes: ['id', 'license'],
            include: [
              {
                model: Site,
                as: 'Site',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
        ...(limit !== undefined && { limit }), // Apply limit only if it's defined
        ...(offset !== undefined && { offset }), // Apply offset only if it's defined
      });

      return tickets.map(ticket => ({
        site: {
          id: ticket.Truck?.Site?.id ?? null,
          name: ticket.Truck?.Site?.name ?? null,
        },
        truck: {
          id: ticket.Truck?.id ?? null,
          license: ticket.Truck?.license ?? null,
        },
        id: ticket.id,
        number: ticket.number,
        dispatchTime: ticket.dispatchTime,
        material: ticket.material,
      }));
    } catch (error) {
      this.log.error({ error }, 'Error occurred while finding tickets');
      throw error;
    }
  }

  /**
   * Use truckId to find the highest number of a ticket (current ticket number) for a site
   *
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
            as: 'Truck',
            where: { id: truckId },
            attributes: [],
            include: [
              {
                model: Site,
                as: 'Site',
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
  async saveTickets(truckId: number, tickets: { truckId: number, dispatchTime: string, material: string }[]): Promise<void> {
    const transaction = await this.client.transaction();
    try {
      const currentTicketNumber = await this._getTicketNumberForSite(truckId);
      await Ticket.bulkCreate(tickets.map((ticket, i) => ({
        ...ticket,
        number: currentTicketNumber + i + 1,
      })), { transaction });
      await transaction.commit();
    } catch (error) {
      this.log.error({ error }, 'Error occurred while saving tickets, aborting transaction');
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
