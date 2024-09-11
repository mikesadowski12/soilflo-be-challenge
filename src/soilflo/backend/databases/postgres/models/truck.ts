import { DataTypes, Model } from 'sequelize';

import { Site } from './site';

class Truck extends Model {
  public id!: number;
  public siteId!: number;
  public license!: string;
}

const schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  siteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Site,
      key: 'id',
    },
  },
  license: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
};

const options = {
  modelName: 'Truck',
};

export {
  Truck,
  schema as TruckSchema,
  options as TruckOptions,
};
