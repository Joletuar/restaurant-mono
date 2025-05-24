import { FastifyRestApiServer } from './http/rest-api/fastify-rest-api-server';

type Config = {
  port?: number;
};

export class RestaurantApiApp {
  private readonly server: any;
  constructor(config: Config) {
    this.server = new FastifyRestApiServer(config.port);
  }

  async init(): Promise<void> {
    await this.server.start();
  }

  async close(): Promise<void> {
    await this.server.stop();
  }
}
