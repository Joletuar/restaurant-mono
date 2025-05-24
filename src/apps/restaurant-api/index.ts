import { FastifyInstance } from 'fastify';

import { ConfigProvider } from './config/app-config';
import { dependencyContainer } from './dependencies/dependency-container';
import { HttpServer } from './http/http-server.interface';
import { FastifyRestApiServer } from './http/rest-api/fastify-rest-api-server';
import { RouteRegistrar } from './http/rest-api/routes/route-registar.interface';

export class RestaurantApiApp {
  private readonly server: HttpServer<FastifyInstance>;
  private readonly config = ConfigProvider.getConfig();
  private readonly dependencies = dependencyContainer;

  constructor() {
    this.server = new FastifyRestApiServer({
      port: this.config.http.port,
      environment: this.config.http.environment,
      routes: [
        this.dependencies.resolve<RouteRegistrar>('OrderRouteRegistrar'),
      ],
    });
  }

  async init(): Promise<void> {
    try {
      await this.server.start();

      this.server
        .getInstance()
        .log.info(
          `[🚀] Restaurant API server started in ${this.config.http.environment} mode`
        );

      this.server
        .getInstance()
        .log.info(`[✅] Server started on port ${this.config.http.port}`);
    } catch (error) {
      console.error('[❎] Error starting server:', error);

      throw error;
    }
  }

  async close(): Promise<void> {
    await this.server.stop();
  }
}
