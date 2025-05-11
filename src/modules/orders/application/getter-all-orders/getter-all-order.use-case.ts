import { OrderRepository } from '@src/modules/orders/domain/order.repository';

import { OrderDto } from '../order.dto';
import { OrderMapper } from '../order.mapper';

export class GetterAllOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<OrderDto[]> {
    const orders = await this.orderRepository.getAll();

    return OrderMapper.toDtoList(orders);
  }
}
