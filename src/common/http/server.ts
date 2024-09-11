/* eslint-disable @typescript-eslint/no-namespace */

import { randomUUID } from 'crypto';

import type { Server } from 'http';
import express, { Request, Response, Express, NextFunction } from 'express';

import { ApiDefinition, Application, Service } from '../application';
import { AbstractMethod, ApiError } from '../internals';
import type { ILogger } from '../application/logger';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

type HttpServerOptions = {
  host: string,
  port: string,
};

type HttpResponseOptions = {
  status?: number,
  headers?: object,
};

type RequestOptions = {
  method: string,
  path: string,
  params: { truckId?: string },
  query: object,
  headers: object,
  cookies: object,
  requestId: string, // request ID
  body?: { tickets?: Array<{ material: string, dispatchTime: string }> },
  logger: ILogger,
}

function addRequestId(request: Request, _response: Response, next: NextFunction): void {
  request.requestId = randomUUID();
  next();
}

class HttpResponse {
  private status: number;
  private headers: object;

  constructor(options?: HttpResponseOptions) {
    const { status, headers } = options || {};
    this.status = status || 200;
    this.headers = {
      'Cache-control': 'no-cache, no-store',
      Expires: '-1',
      Pragma: 'no-cache',
      ...headers,
    };
  }

  async process(response: Response) {
    response.status(this.status).header(this.headers);
  }
}

class EmptyResponse extends HttpResponse {
  async process(response: Response) {
    super.process(response);
    response.send();
  }
}

class JsonResponse extends HttpResponse {
  private body: object;
  private options?: object;

  constructor(body: object, options?: HttpResponseOptions) {
    super(options);
    this.options = options;
    this.body = body;
  }

  async process(response: Response) {
    super.process(response);
    response.type('application/json').send(this.body);
  }
}

class HttpServer extends Service {
  private options: HttpServerOptions;
  private config: ApiDefinition;
  private app: Express;
  private server: Server | null;

  constructor(application: Application, options: HttpServerOptions) {
    super(application);
    const { host, port } = options;
    this.options = { host, port };
    this.config = application.config.getApi();
    this.server = null;

    this.app = express();
    this.app.use(express.json()); // Middleware to parse JSON
    this.app.use(addRequestId);
    this.definition();
  }

  /**
   * Add a route/endpoint
   */
  route(method: 'POST'|'PUT'|'GET'|'DELETE', path: string, handler: Function) { // eslint-disable-line @typescript-eslint/no-unsafe-function-type
    const bound = handler.bind(this);
    const callback = (request: Request, response: Response) => {
      Promise.resolve()
        .then(async () => {
          const handlerResponse = await bound(request);
          await handlerResponse.process(response);
        });
    };

    switch (method) {
      case 'POST':
        this.app.post(path, callback);
        break;
      case 'PUT':
        this.app.put(path, callback);
        break;
      case 'GET':
        this.app.get(path, callback);
        break;
      case 'DELETE':
        this.app.delete(path, callback);
        break;
      default:
        throw new ApiError({ method }, 'Unknown method for route definition');
    }
  }

  /**
   * Define endpoints in child class
   */
  definition() {
    throw new AbstractMethod();
  }

  /**
   * Start the server and listen on a port
   */
  async start() {
    this.server = this.app.listen(this.options);
  }

  /**
   * Stop the server
   */
  async stop() {
    if (!this.server) {
      return;
    }
    this.server.close();
  }
}

export {
  HttpServer,
  HttpResponse,
  EmptyResponse,
  JsonResponse,
  RequestOptions,
};
