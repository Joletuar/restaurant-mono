import { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { OrderStatus } from '@src/bounded-contexts/orders/domain/value-objects/order-status.value-object';
import { LogLevel } from '@src/bounded-contexts/shared/domain/logger.interface';
import { LogMethod } from '@src/bounded-contexts/shared/infraestructure/logger/decorators/log-method.decorator';

import { FinderOrderById } from '../finder-order-by-id/finder-order-by-id.use-case';
import { UpdateOrderByIdDto } from './updater-order-by-id.dto';

export class UpdaterOrderById {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly finderOrderById: FinderOrderById
  ) {}

  @LogMethod({
    level: LogLevel.INFO,
    logParams: true,
    logResult: true,
  })
  async execute(
    id: string,
    updateOrderByIdDto: UpdateOrderByIdDto
  ): Promise<void> {
    const order = await this.getOrderById(id);

    order.updateStatus(OrderStatus.fromPrimitives(updateOrderByIdDto.status));

    await this.orderRepository.update(order);
  }

  private async getOrderById(id: string): Promise<Order> {
    const orderDto = await this.finderOrderById.execute(id);

    return Order.fromPrimitives(orderDto);
  }
}
