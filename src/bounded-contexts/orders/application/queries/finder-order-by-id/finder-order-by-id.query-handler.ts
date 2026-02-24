import type { OrderDto } from '@src/bounded-contexts/orders/application/order.dto';
import type { OrderReadModelRepository } from '@src/bounded-contexts/orders/application/read-models/order-read-model.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import { NotFoundOrderError } from '../../errors/not-found-order.error';
import type { FinderOrderByIdQuery } from './finder-order-by-id.query';

export class FinderOrderByIdQueryHandler
  implements QueryHandler<FinderOrderByIdQuery, OrderDto>
{
  constructor(private readonly orderReadRepository: OrderReadModelRepository) {}

  async handle(query: FinderOrderByIdQuery): Promise<QueryResponse<OrderDto>> {
    const order = await this.orderReadRepository.findById(query.orderId);

    if (!order) {
      throw new NotFoundOrderError();
    }

    return { data: order };
  }
}
