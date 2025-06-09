import type { FastifyInstance } from 'fastify';

import type { OrderController } from '../controllers/order.controller';
import type { FastifyTypeBox } from '../types/fastify-typebox.type';
import type { RouteRegistrar } from './route-registar.interface';

export class OrderRouteRegistrar implements RouteRegistrar {
  constructor(private readonly orderController: OrderController) {}

  async registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.register(
      async (instance: FastifyTypeBox) => {
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
