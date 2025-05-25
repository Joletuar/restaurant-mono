import { FastifyInstance } from 'fastify';

import { HealthCheckController } from '../controllers/health-check.controller';
import { RouteRegistrar } from './route-registar.interface';

export class HealthCheckRouteRegistar implements RouteRegistrar {
  constructor(private readonly controller: HealthCheckController) {}

  async registerRoutes(server: FastifyInstance): Promise<void> {
    server.register(
      (instance) => {
        instance.get('/', this.controller.execute.bind(this.controller));
      },
      {
        prefix: '/ping',
      }
    );
  }
}
