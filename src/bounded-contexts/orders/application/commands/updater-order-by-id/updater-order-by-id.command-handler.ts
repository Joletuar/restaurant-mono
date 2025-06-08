import type { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { OrderStatus } from '@src/bounded-contexts/orders/domain/value-objects/order-status.value-object';
import type { CommandHandler } from '@src/bounded-contexts/shared/domain/command-bus.interface';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import type { UpdaterOrderByIdCommand } from './updater-order-by-id.command';

export class UpdaterOrderByIdCommandHandler
  implements CommandHandler<UpdaterOrderByIdCommand>
{
  constructor(private readonly repository: OrderRepository) {}

  async handle(cmd: UpdaterOrderByIdCommand): Promise<void> {
    const { orderId, status } = cmd.props;

    const order = await this.ensureExistsOrder(orderId);

    order.updateStatus(OrderStatus.fromPrimitives(status));

    await this.repository.update(order);
  }

  private async ensureExistsOrder(orderId: string): Promise<Order> {
    const order = await this.repository.findById(
      IdValueObject.fromPrimitives(orderId)
    );

    if (!order) {
      throw new NotFoundError('Order not found', [
        `Order with id <${orderId}> doesn't exists.`,
      ]);
    }

    return order;
  }
}
