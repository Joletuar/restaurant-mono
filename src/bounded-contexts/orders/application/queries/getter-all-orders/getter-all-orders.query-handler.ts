import { OrderMapper } from '@src/bounded-contexts/orders/application/order.mapper';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import type { QueryHandler } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { GetterAllOrdersQuery } from './getter-all-orders.query';
import type { GetterAllOrdersQueryResponse } from './getter-all-orders.query-response';

export class GetterAllOrdersQueryHandler
  implements QueryHandler<GetterAllOrdersQuery, GetterAllOrdersQueryResponse>
{
  constructor(private readonly orderRepository: OrderRepository) {}

  async handle(): Promise<GetterAllOrdersQueryResponse> {
    const orders = await this.orderRepository.getAll();

    return { data: OrderMapper.toDtoList(orders) };
  }
}
