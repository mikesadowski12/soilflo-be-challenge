/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { expect } from 'chai';

describe('GET Tickets Integration Tests', () => {
  const baseURL: string = 'http://localhost:8000';

  before(async () => {});

  after(async () => {});

  describe('Success (200) response', () => {
    it('should return a JSON response with a message', async () => {
      const response = await axios.get(`${baseURL}/api/v1/tickets`);
      expect(response).to.have.property('status', 200);
      expect(response).to.have.property('statusText', 'OK');
      expect(response).to.have.property('data');
      expect(response.data).to.have.property('greeting', 'Hello!');
    });
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
