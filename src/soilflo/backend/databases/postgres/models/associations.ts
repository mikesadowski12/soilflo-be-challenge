import { Site } from './site';
import { Truck } from './truck';
import { Ticket } from './ticket';

/**
 * Create model assocations to each other
 */
function associate() {
  Ticket.belongsTo(Truck, { foreignKey: 'truckId', as: 'Truck' });
  Truck.hasMany(Ticket, { foreignKey: 'truckId', as: 'Tickets' });
  Truck.belongsTo(Site, { foreignKey: 'siteId', as: 'Site' });
  Site.hasMany(Truck, { foreignKey: 'siteId', as: 'Trucks' });
}

export { associate };
