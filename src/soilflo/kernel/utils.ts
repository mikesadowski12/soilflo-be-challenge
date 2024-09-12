import { BadRequestError, ConflictError } from '../../common';
import type { ApiTicket } from './abstract';

/**
 * Validate the dispatch time is not a future date
 * (Throws error if validation fails)
 */
function validateDispatchTime(time: string): void {
  const date = new Date(time);
  if (Number.isNaN(date.getMonth())) {
    throw new BadRequestError({ time }, 'Dispatch time not a valid date');
  }

  const today = new Date();
  if (date.getTime() > today.getTime()) {
    throw new BadRequestError({ time }, 'Dispatch time is at a future date');
  }
}

/**
 * Ensure that a list of dispatch times are unique for a batch of
 * tickets for a truck.
 * (Throws error if validation fails)
 */
function validateDispatchTimeUniqueness(tickets: ApiTicket[]): void {
  const unique = new Set();
  tickets.forEach((ticket) => {
    const dispatchTime = ticket.getDispatchTime();
    if (unique.has(dispatchTime)) {
      throw new ConflictError({ time: dispatchTime }, 'Dispatch time for a truck must be unique');
    }
    unique.add(dispatchTime)
  });
}

export {
  validateDispatchTime,
  validateDispatchTimeUniqueness,
};
