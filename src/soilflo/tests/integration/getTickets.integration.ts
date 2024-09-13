/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { expect } from 'chai';

describe('GET Tickets Integration Tests', () => {
  const baseURL: string = 'http://localhost:8000';

  async function createTicket(truckId: number, dispatchTime: string) {
    const ticket1 = { dispatchTime, material: 'Soil' };
    const response = await axios.post(`${baseURL}/api/v1/trucks/${truckId}/tickets`, { tickets: [ticket1] });
    expect(response).to.have.property('status', 200);
    expect(response).to.have.property('statusText', 'OK');
    expect(response).to.have.property('data');
    expect(response.data).to.equal('');
  }

  before(async () => {});

  after(async () => {});

  describe('Success (200) response', () => {
    before(async () => {
      await createTicket(1, '1999-09-11T19:41:17.780Z');
    });

    it('should return a JSON response with a message', async () => {
      const response = await axios.get(`${baseURL}/api/v1/tickets`);
      expect(response).to.have.property('status', 200);
      expect(response).to.have.property('statusText', 'OK');
      expect(response).to.have.property('data');
      expect(response.data).to.have.property('tickets');
      expect(response.data.tickets).to.be.an('array');
      expect(response.data.tickets.length).to.be.at.least(1);
      const ticket = response.data.tickets[0];
      expect(ticket).to.have.property('siteName');
      expect(ticket).to.have.property('truckLicensePlate');
      expect(ticket).to.have.property('number');
      expect(ticket).to.have.property('dispatchTime');
      expect(ticket).to.have.property('material');
    });

    // Lots more tests to test each filter/filter combinations
  });

  describe('Bad request (400) errors', () => {
     // Lots of tests to catch invalid data in the query params:
     // siteId (not integer, etc)
     // startDate (not a string, not valid time, etc)
     // endDate (not a string, not valid time, etc)
     // pageNumber (not integer, missing pageNum, etc)
     // pageNum (not integer, missing pageNumber, etc)
  });

  describe('Server (500) errors', () => {
    // let stub: SinonStub;

    before(() => {
      // stub = sinon.stub(postgres, 'findTickets').throws(new Error('I am a stubbed error'));
    });

    after(() => {
      // stub.restore();
    });

    it('should catch the error and return a 500 error', async () => {
      // Stub the method 'findTickets' to throw an error
      // Confirm error is caught in handler
      // confirm 500 error is thrown
      // (can't stub this because tests aren't creating their own API, so I am describing what I would do)
    });
  });
});
