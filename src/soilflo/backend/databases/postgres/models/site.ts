import { DataTypes, Model } from 'sequelize';

class Site extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public description!: string;
}

const schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
};

const options = {
  modelName: 'Site',
};

export {
  Site,
  schema as SiteSchema,
  options as SiteOptions,
};
