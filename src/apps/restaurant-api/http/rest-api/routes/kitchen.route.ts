import type { FastifyInstance } from 'fastify';

import type { KitchenController } from '../controllers/kitchen.controller';
import type { RouteRegistrar } from './route-registar.interface';

export class KitchenRouteRegistrar implements RouteRegistrar {
  constructor(private readonly controller: KitchenController) {}

  async registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.register(
      async (instance) => {
        instance.get('/queue', this.controller.getQueue.bind(this.controller));
      },
      { prefix: '/kitchen' }
    );
  }
}
