import axios from 'axios';
import { expect } from 'chai';

describe('POST Tickets Integration Tests', () => {
  const baseURL: string = 'http://localhost:8000';

  before(async () => {});

  after(async () => {});

  it('should return a JSON response with a message', async () => {
    const response = await axios.get(`${baseURL}/api/v1/tickets`);
    expect(response).to.have.property('status', 200);
    expect(response).to.have.property('statusText', 'OK');
    expect(response).to.have.property('data');
    expect(response.data).to.have.property('greeting', 'Hello!');
  });
});
