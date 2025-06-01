import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { LogMethod } from '@src/bounded-contexts/shared/infraestructure/logger/decorators/log-method.decorator';

import type { OrderDto } from '../../order.dto';
import { OrderMapper } from '../../order.mapper';

export class GetterAllOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  @LogMethod({
    logParams: true,
    logResult: true,
  })
  async execute(): Promise<OrderDto[]> {
    const orders = await this.orderRepository.getAll();

    return OrderMapper.toDtoList(orders);
  }
}
