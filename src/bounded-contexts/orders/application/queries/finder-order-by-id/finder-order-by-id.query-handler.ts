import { OrderMapper } from '@src/bounded-contexts/orders/application/order.mapper';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
import type { QueryHandler } from '@src/bounded-contexts/shared/domain/query-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import type { FinderOrderByIdQuery } from './finder-order-by-id.query';
import type { FinderOrderByIdQueryReponse } from './finder-order-by-id.query-response';

export class FinderOrderByIdQueryHandler
  implements QueryHandler<FinderOrderByIdQuery, FinderOrderByIdQueryReponse>
{
  constructor(private readonly orderRepository: OrderRepository) {}

  async handle(
    query: FinderOrderByIdQuery
  ): Promise<FinderOrderByIdQueryReponse> {
    const order = await this.orderRepository.findById(
      IdValueObject.fromPrimitives(query.orderId)
    );

    if (!order) {
      throw new NotFoundError('Order not found', [
        `Order with id <${query.orderId}> not found.`,
      ]);
    }

    return { data: OrderMapper.toDto(order) };
  }
}
