import type { FastifyInstance } from 'fastify';

import type { HealthCheckController } from '../controllers/health-check.controller';
import type { RouteRegistrar } from './route-registar.interface';

export class HealthCheckRouteRegistrar implements RouteRegistrar {
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
