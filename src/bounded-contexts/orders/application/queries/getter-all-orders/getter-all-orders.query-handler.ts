import type { OrderDto } from '@src/bounded-contexts/orders/application/order.dto';
import { OrderMapper } from '@src/bounded-contexts/orders/application/order.mapper';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { GetterAllOrdersQuery } from './getter-all-orders.query';

export class GetterAllOrdersQueryHandler
  implements QueryHandler<GetterAllOrdersQuery, OrderDto[]>
{
  constructor(private readonly orderRepository: OrderRepository) {}

  async handle(): Promise<QueryResponse<OrderDto[]>> {
    const orders = await this.orderRepository.getAll();

    return { data: OrderMapper.toDtoList(orders) };
  }
}
