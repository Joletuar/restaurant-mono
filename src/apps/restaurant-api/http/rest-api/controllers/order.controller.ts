import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CreatorOrder } from '@src/bounded-contexts/orders/application/creator-order/creator-order.use-case';
import type { FinderOrderById } from '@src/bounded-contexts/orders/application/finder-order-by-id/finder-order-by-id.use-case';
import type { GetterAllOrders } from '@src/bounded-contexts/orders/application/getter-all-orders/getter-all-order.use-case';
import type { UpdaterOrderById } from '@src/bounded-contexts/orders/application/updater-order-by-id/updater-order-by-id.use-case';

import { HttpStatusCode } from '../contracts/api-contracts';
import { ResponseBuilder } from '../utils/response.builder';

export class OrderController {
  constructor(
    private readonly finderOrderById: FinderOrderById,
    private readonly getterAllOrders: GetterAllOrders,
    private readonly creatorOrder: CreatorOrder,
    private readonly updaterOrderById: UpdaterOrderById
  ) {}

  async getAllOrders(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const orders = await this.getterAllOrders.execute();

    return await ResponseBuilder.success({
      reply,
      data: orders,
    });
  }

  async getOrderById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const order = await this.finderOrderById.execute(id);

    return ResponseBuilder.success({
      reply,
      data: order,
    });
  }

  async createOrder(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const orderData = request.body as { recipeId: string; status: string };

    await this.creatorOrder.execute(orderData);

    return await ResponseBuilder.successNoContent({
      reply,
      statusCode: HttpStatusCode.CREATED,
    });
  }

  async updateOrder(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const updateData = request.body as { status: string };

    await this.updaterOrderById.execute(id, updateData);

    return await ResponseBuilder.successNoContent({ reply });
  }
}
