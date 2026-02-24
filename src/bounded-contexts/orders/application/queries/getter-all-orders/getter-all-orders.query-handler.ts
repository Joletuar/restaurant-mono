import type { OrderDto } from '@src/bounded-contexts/orders/application/order.dto';
import type { OrderReadModelRepository } from '@src/bounded-contexts/orders/application/read-models/order-read-model.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { GetterAllOrdersQuery } from './getter-all-orders.query';

export class GetterAllOrdersQueryHandler
  implements QueryHandler<GetterAllOrdersQuery, OrderDto[]>
{
  constructor(private readonly orderReadRepository: OrderReadModelRepository) {}

  async handle(): Promise<QueryResponse<OrderDto[]>> {
    const orders = await this.orderReadRepository.getAll();

    return { data: orders };
  }
}
