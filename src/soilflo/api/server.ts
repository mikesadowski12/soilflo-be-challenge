import {
  EmptyResponse,
  HttpServer,
  type Application,
  type HttpResponse,
  type RequestOptions,
} from '../../common';
import { type Kernel } from '../kernel';
import type { Backend } from '../backend';

class Api extends HttpServer {
  private application: Application;
  private backend: Backend;
  private kernel: Kernel;

  constructor(application: Application, backend: Backend, kernel: Kernel) {
    const { port, bind } = application.config.getApi();
    super(application, { host: bind, port });
    this.application = application;
    this.backend = backend;
    this.kernel = kernel;
  }

  definition() {
    this.route('GET', '/', this.hello);
  }

  async hello({ logger }: RequestOptions): Promise<HttpResponse> {
    try {
      this.log.info({}, 'Hello handler');
      return new EmptyResponse();
    } catch (error) {
      this.log.error({ error }, 'Error in hello handler');
      return new EmptyResponse({ status: 500 });
    }
  }
}

export { Api };
