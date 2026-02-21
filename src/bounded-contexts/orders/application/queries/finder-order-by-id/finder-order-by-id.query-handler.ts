import type { OrderDto } from '@src/bounded-contexts/orders/application/order.dto';
import { OrderMapper } from '@src/bounded-contexts/orders/application/order.mapper';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import { NotFoundOrderError } from '../../errors/not-found-order.error';
import type { FinderOrderByIdQuery } from './finder-order-by-id.query';

export class FinderOrderByIdQueryHandler
  implements QueryHandler<FinderOrderByIdQuery, OrderDto>
{
  constructor(private readonly orderRepository: OrderRepository) {}

  async handle(query: FinderOrderByIdQuery): Promise<QueryResponse<OrderDto>> {
    const order = await this.orderRepository.findById(
      IdValueObject.fromPrimitives(query.orderId)
    );

    if (!order) {
      throw new NotFoundOrderError();
    }

    return { data: OrderMapper.toDto(order) };
  }
}
