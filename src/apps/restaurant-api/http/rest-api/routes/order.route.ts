import { Type } from '@fastify/type-provider-typebox';
import type { FastifyInstance } from 'fastify';

import type { OrderController } from '../controllers/order.controller';
import type { FastifyTypebox } from '../fastify-rest-api-server';
import type { RouteRegistrar } from './route-registar.interface';

export class OrderRouteRegistrar implements RouteRegistrar {
  constructor(private readonly orderController: OrderController) {}

  async registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.register(
      async (instance: FastifyTypebox) => {
        instance.get(
          '/',
          this.orderController.getAllOrders.bind(this.orderController)
        );

        instance.get(
          '/:id',
          this.orderController.getOrderById.bind(this.orderController)
        );

        instance.post(
          '/',
          this.orderController.createOrder.bind(this.orderController)
        );

        instance.patch(
          '/:id',
          this.orderController.updateOrder.bind(this.orderController)
        );
      },
      { prefix: '/orders' }
    );
  }
}
