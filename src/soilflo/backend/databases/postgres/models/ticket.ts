import { DataTypes, Model } from 'sequelize';

import { Truck } from './truck';

class Ticket extends Model {
  public id!: number;
  public truckId!: number;
  public dispatchTime!: Date;
  public material!: string;
  public number!: string;
}

const schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  truckId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Truck,
      key: 'id',
    },
  },
  dispatchTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  material: {
    type: DataTypes.ENUM('Soil'),
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
};

const options = {
  modelName: 'Ticket',
  indexes: [
    {
      unique: true,
      fields: ['truckId', 'dispatchTime'],
    },
  ],
};

export {
  Ticket,
  schema as TicketSchema,
  options as TicketOptions,
};
