import type { FastifyReply, FastifyRequest } from 'fastify';

import { CreatorOrderCommand } from '@src/bounded-contexts/orders/application/commands/creator-order/creator-order.command';
import { FinderOrderByIdQuery } from '@src/bounded-contexts/orders/application/queries/finder-order-by-id/finder-order-by-id.query';
import { GetterAllOrdersQuery } from '@src/bounded-contexts/orders/application/queries/getter-all-orders/getter-all-orders.query';
import type { CommandBus } from '@src/bounded-contexts/shared/domain/command-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/query-bus.interface';

import { HttpStatusCode } from '../contracts/api-contracts';
import { ResponseBuilder } from '../utils/response.builder';

export class OrderController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  async getAllOrders(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const query = new GetterAllOrdersQuery({ reqId: request.id });

    const orders = await this.queryBus.dispatch(query);

    return await ResponseBuilder.success({
      reply,
      data: orders,
    });
  }

  async getOrderById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    // TODO: añadir validaciones de esquemas para datos basura y validaciones comunes

    const { id } = request.params;

    const query = new FinderOrderByIdQuery(id, { reqId: request.id });

    const order = await this.queryBus.dispatch(query);

    return await ResponseBuilder.success({
      reply,
      data: order,
    });
  }

  async createOrder(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    // TODO: añadir validaciones de esquemas para datos basura y validaciones comunes

    const orderData = request.body as { recipeId: string; status: string };

    const command = new CreatorOrderCommand(orderData, { reqId: request.id });

    await this.commandBus.dispatch(command);

    return await ResponseBuilder.successNoContent({
      reply,
      statusCode: HttpStatusCode.CREATED,
    });
  }

  // async updateOrder(
  //   request: FastifyRequest<{ Params: { id: string } }>,
  //   reply: FastifyReply
  // ): Promise<void> {
  //   const { id } = request.params;
  //   const updateData = request.body as { status: string };

  //   await this.updaterOrderById.execute(id, updateData);

  //   return await ResponseBuilder.successNoContent({ reply });
  // }
}
