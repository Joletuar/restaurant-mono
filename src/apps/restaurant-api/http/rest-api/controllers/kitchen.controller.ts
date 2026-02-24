import type { FastifyReply, FastifyRequest } from 'fastify';

import { GetterKitchenQueueQuery } from '@src/bounded-contexts/orders/application/queries/getter-kitchen-queue/getter-kitchen-queue.query';
import type { KitchenOrderReadModel } from '@src/bounded-contexts/orders/application/read-models/kitchen-order.read-model';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import { ResponseBuilder } from '../utils/response.builder';

export class KitchenController {
  constructor(private readonly queryBus: QueryBus) {}

  async getQueue(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const query = new GetterKitchenQueueQuery({ reqId: request.id });

    const queue = await this.queryBus.dispatch<
      GetterKitchenQueueQuery,
      KitchenOrderReadModel[]
    >(query);

    return await ResponseBuilder.success({
      reply,
      data: queue.data,
    });
  }
}
