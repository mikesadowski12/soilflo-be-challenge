/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { expect } from 'chai';

describe('POST Tickets Integration Tests', () => {
  const baseURL: string = 'http://localhost:8000';

  before(async () => {});

  after(async () => {});

  describe('Success (200) response', () => {
    it('should successfully save the tickets in the system/database', async () => {
      const truckId = 1;
      const ticket1 = { dispatchTime: '2000-09-11T19:41:17.780Z', material: 'Soil' };
      const ticket2 = { dispatchTime: '2001-09-11T19:41:17.780Z', material: 'Soil' };

      const response = await axios.post(`${baseURL}/api/v1/trucks/${truckId}/tickets`, { tickets: [ticket1, ticket2] });
      expect(response).to.have.property('status', 200);
      expect(response).to.have.property('statusText', 'OK');
      expect(response).to.have.property('data');
      expect(response.data).to.equal('');

      // Some code here to check DB entries and confirm it was saved
    });
  });

  describe('Bad request (400) errors', () => {
    describe('Truck', () => {
      // Test to catch the invalid truck ID (must be integer)
    });

    describe('Request Body', () => {
      // Lots of tests to catch missing/invalid data in the body:
        // Missing tickets array
        // Missing dispatchTime
        // Missing material
        // Invalid dispatchTime date
        // Invalid materal
        // Future dispatchTime
        // etc ...
    });
  });

  describe('Conflict (409) errors', () => {
    it('should catch duplicate dispatch times and not save to DB', async () => {
      const truckId = 1;
      const dispatchTime = '1992-09-11T19:41:17.780Z';
      const ticket1 = { dispatchTime, material: 'Soil' };
      const ticket2 = { dispatchTime, material: 'Soil' };
      let response;
      let responseError: any;
      try {
        response = await axios.post(`${baseURL}/api/v1/trucks/${truckId}/tickets`, { tickets: [ticket1, ticket2] });
      } catch (error) {
        responseError = error;
      }

      expect(response).to.equal(undefined);
      expect(responseError).to.not.equal(undefined);
      expect(responseError).to.have.property('response');
      expect(responseError.response).to.have.property('status', 409);
      expect(responseError.response).to.have.property('statusText', 'Conflict');
      expect(responseError.response).to.have.property('data');
      expect(responseError.response.data).to.have.property('error', 'Dispatch time for a truck must be unique');

      // Some code here to check DB entries and confirm it was NOT saved
    });
  });

  describe('Server (500) errors', () => {
    // let stub: SinonStub;

    before(() => {
      // stub = sinon.stub(postgres, '_getTicketNumberForSite').throws(new Error('I am a stubbed error'));
    });

    after(() => {
      // stub.restore();
    });

    it('should catch the error, abort transaction and not save to DB', async () => {
      // Stub the method '_getTicketNumberForSite' to throw an error
      // Confirm transaction was aborted
      // Confirm DB state has not changed
      // (can't stub this because tests aren't creating their own API, so I am describing what I would do)
    });
  });
});
