import { BadRequestError, ConflictError } from '../../common';
import type { ApiTicket } from './abstract';
import { materials } from './consts';

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
 * Validate the material is a valid string in the allowed materials list
 */
function validateMaterial(material: string) {
  if (!materials.has(material)) {
    throw new BadRequestError({ material }, 'Material is not a valid value');
  }
}

/**
 * Loop through the array of tickets in the request body
 * and validate their structure/contents exist
 */
function validateTicketsRequestBody(tickets: { dispatchTime: unknown, material: unknown }[]) {
  tickets.forEach((ticket) => {
    if (!ticket.dispatchTime || typeof ticket.dispatchTime !== 'string') {
      throw new BadRequestError({ time: String(ticket.dispatchTime) }, 'Dispatch time is missing or not a valid value');
    }
    validateDispatchTime(ticket.dispatchTime)

    if (!ticket.material || typeof ticket.material !== 'string') {
      throw new BadRequestError({ material: String(ticket.material) }, 'Material is missing or not a valid value');
    }
    validateMaterial(ticket.material);
  });
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
  validateDispatchTimeUniqueness,
  validateTicketsRequestBody,
};
