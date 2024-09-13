/* eslint-disable @typescript-eslint/no-explicit-any */

import { expect } from 'chai';

import { validateDispatchTimeUniqueness, validateTicketsRequestBody } from '../../../kernel';
import { BadRequestError, MINUTE } from '../../../../common';

describe('Kernel Unit Tests - Utils', () => {
  describe('validateDispatchTimeUniqueness()', () => {
    it('should throw \'BadRequestError\' if dispatchTime is not unique in the array of ApiTickets', () => {
      validateDispatchTimeUniqueness([]);
    });
  });

  describe('validateTicketsRequestBody()', () => {
    describe('dispatchTime', () => {
      it('should throw \'BadRequestError\' if dispatchTime is undefined for a ticket in the array', () => {
        const ticket1 = { dispatchTime: '2000-09-11T19:41:17.780Z', material: 'Soil' };
        const ticket2 = { dispatchTime: undefined, material: 'Soil' };
        let response;
        try {
          validateTicketsRequestBody([ticket1, ticket2])
        } catch (error) {
          response = error;
        }
        expect(response).to.not.equal(undefined);
        expect(response).to.have.property('message', 'Dispatch time is missing or not a valid value');
        expect(response instanceof BadRequestError).to.equal(true);
      });

      it('should throw \'BadRequestError\' if dispatchTime is not a string for a ticket in the array', () => {
        const ticket1 = { dispatchTime: '2000-09-11T19:41:17.780Z', material: 'Soil' };
        const ticket2 = { dispatchTime: 2, material: 'Soil' };
        let response;
        try {
          validateTicketsRequestBody([ticket1, ticket2])
        } catch (error) {
          response = error;
        }
        expect(response).to.not.equal(undefined);
        expect(response).to.have.property('message', 'Dispatch time is missing or not a valid value');
        expect(response instanceof BadRequestError).to.equal(true);
      });

      it('should throw \'BadRequestError\' if dispatchTime is not a date string for a ticket in the array', () => {
        const ticket1 = { dispatchTime: '2000-09-11T19:41:17.780Z', material: 'Soil' };
        const ticket2 = { dispatchTime: 'hello', material: 'Soil' };
        let response;
        try {
          validateTicketsRequestBody([ticket1, ticket2])
        } catch (error) {
          response = error;
        }
        expect(response).to.not.equal(undefined);
        expect(response).to.have.property('message', 'Dispatch time not a valid date');
        expect(response instanceof BadRequestError).to.equal(true);
      });

      it('should throw \'BadRequestError\' if dispatchTime is a date in the future', () => {
        const future = new Date(Date.now() + 5*MINUTE);
        const ticket1 = { dispatchTime: '2000-09-11T19:41:17.780Z', material: 'Soil' };
        const ticket2 = { dispatchTime: future.toISOString(), material: 'Soil' };
        let response: any;
        try {
          validateTicketsRequestBody([ticket1, ticket2])
        } catch (error) {
          response = error;
        }
        expect(response).to.not.equal(undefined);
        expect(response).to.have.property('message', 'Dispatch time is at a future date');
        expect(response instanceof BadRequestError).to.equal(true);
      });
    });

    describe('material', () => {
      it('should throw \'BadRequestError\' if material is undefined for a ticket in the array', () => {
        const ticket1 = { dispatchTime: '2000-09-11T19:41:17.780Z', material: 'Soil' };
        const ticket2 = { dispatchTime: '2001-09-11T19:41:17.780Z', material: undefined };
        let response;
        try {
          validateTicketsRequestBody([ticket1, ticket2])
        } catch (error) {
          response = error;
        }
        expect(response).to.not.equal(undefined);
        expect(response).to.have.property('message', 'Material is missing or not a valid value');
        expect(response instanceof BadRequestError).to.equal(true);
      });

      it('should throw \'BadRequestError\' if material is not a string for a ticket in the array', () => {
        const ticket1 = { dispatchTime: '2000-09-11T19:41:17.780Z', material: 'Soil' };
        const ticket2 = { dispatchTime: '2001-09-11T19:41:17.780Z', material: 1 };
        let response;
        try {
          validateTicketsRequestBody([ticket1, ticket2])
        } catch (error) {
          response = error;
        }
        expect(response).to.not.equal(undefined);
        expect(response).to.have.property('message', 'Material is missing or not a valid value');
        expect(response instanceof BadRequestError).to.equal(true);
      });

      it('should throw \'BadRequestError\' if material is not a permitted material', () => {
        const ticket1 = { dispatchTime: '2000-09-11T19:41:17.780Z', material: 'Soil' };
        const ticket2 = { dispatchTime: '2001-09-11T19:41:17.780Z', material: 'I am not a valid material' };
        let response;
        try {
          validateTicketsRequestBody([ticket1, ticket2])
        } catch (error) {
          response = error;
        }
        expect(response).to.not.equal(undefined);
        expect(response).to.have.property('message', 'Material is not a valid value');
        expect(response instanceof BadRequestError).to.equal(true);
      });
    });
  });
});
