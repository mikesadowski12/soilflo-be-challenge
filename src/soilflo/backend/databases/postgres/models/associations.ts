import { Site } from './site';
import { Truck } from './truck';
import { Ticket } from './ticket';

/**
 * Create model assocations to each other
 */
function associate() {
  Site.hasMany(Truck, {
    foreignKey: 'siteId',
    as: 'trucks',
  });

  Truck.hasMany(Ticket, {
    foreignKey: 'truckId',
    as: 'tickets',
  });

  Ticket.belongsTo(Truck, {
    foreignKey: 'truckId',
    as: 'truck',
  });
}

export { associate };
