import type { FastifyReply, FastifyRequest } from 'fastify';

import { CreatorOrderCommand } from '@src/bounded-contexts/orders/application/commands/creator-order/creator-order.command';
import { UpdaterOrderByIdCommand } from '@src/bounded-contexts/orders/application/commands/updater-order-by-id/updater-order-by-id.command';
import type { OrderDto } from '@src/bounded-contexts/orders/application/order.dto';
import { FinderOrderByIdQuery } from '@src/bounded-contexts/orders/application/queries/finder-order-by-id/finder-order-by-id.query';
import { GetterAllOrdersQuery } from '@src/bounded-contexts/orders/application/queries/getter-all-orders/getter-all-orders.query';
import type { CommandBus } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infrastructure.error';
import { InvalidPathParameter } from '@src/bounded-contexts/shared/infrastructure/http/errors/invalid-path-parameter.error';
import { InvalidRequestBody } from '@src/bounded-contexts/shared/infrastructure/http/errors/invalid-request-body.error';

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
  ): Promise<FastifyReply> {
    const query = new GetterAllOrdersQuery({ reqId: request.id });

    const orders = await this.queryBus.dispatch<
      GetterAllOrdersQuery,
      OrderDto[]
    >(query);

    return await ResponseBuilder.success({
      reply,
      data: orders,
    });
  }

  async getOrderById(
    request: FastifyRequest<{
      Params: { id?: string };
    }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;

    if (
      id === null ||
      id === undefined ||
      (id && id.length === 0) ||
      !isNaN(Number(id))
    ) {
      throw new InfrastructureError(
        `Invalid path parameter`,
        new InvalidPathParameter('id')
      );
    }

    const query = new FinderOrderByIdQuery(id, { reqId: request.id });

    const order = await this.queryBus.dispatch(query);

    return await ResponseBuilder.success({
      reply,
      data: order,
    });
  }

  async createOrder(
    request: FastifyRequest<{ Body?: { recipeId?: string; status?: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const orderData = request.body;

    if (orderData === undefined) {
      throw new InfrastructureError(
        'Body has not provided',
        new InvalidRequestBody(['body request is requiered'])
      );
    }

    const { recipeId, status } = orderData;

    if (
      recipeId === undefined ||
      status === undefined ||
      recipeId.length === 0 ||
      status.length === 0
    ) {
      throw new InfrastructureError(
        'Body has not correct schema',
        new InvalidRequestBody([
          'recipeId is requiered and must be a valid string',
          'status is requiered and must be a valid string',
        ])
      );
    }

    const command = new CreatorOrderCommand(
      { recipeId, status },
      { reqId: request.id }
    );

    await this.commandBus.dispatch(command);

    return await ResponseBuilder.successNoContent({
      reply,
      statusCode: HttpStatusCode.CREATED,
    });
  }

  async updateOrder(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { status: string };
    }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;
    const updateData = request.body;

    await this.commandBus.dispatch(
      new UpdaterOrderByIdCommand(
        { orderId: id, status: updateData.status },
        { reqId: request.id }
      )
    );

    return await ResponseBuilder.successNoContent({ reply });
  }
}
