import { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { LogLevel } from '@src/bounded-contexts/shared/domain/logger.interface';
import { LoggerMethod } from '@src/bounded-contexts/shared/infraestructure/logger/decorators/logger-method.decorator';

import { OrderDto } from '../order.dto';
import { OrderMapper } from '../order.mapper';

export class GetterAllOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  @LoggerMethod({
    level: LogLevel.INFO,
    logParams: true,
    logResult: true,
  })
  async execute(): Promise<OrderDto[]> {
    const orders = await this.orderRepository.getAll();

    return OrderMapper.toDtoList(orders);
  }
}
