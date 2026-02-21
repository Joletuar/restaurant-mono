import type { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { OrderStatus } from '@src/bounded-contexts/orders/domain/value-objects/order-status.value-object';
import type { CommandHandler } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { EventBus } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import { NotFoundOrderError } from '../../errors/not-found-order.error';
import type { UpdaterOrderByIdCommand } from './updater-order-by-id.command';

export class UpdaterOrderByIdCommandHandler
  implements CommandHandler<UpdaterOrderByIdCommand>
{
  constructor(
    private readonly repository: OrderRepository,
    private readonly eventBus: EventBus
  ) {}

  async handle(cmd: UpdaterOrderByIdCommand): Promise<void> {
    const { orderId, status } = cmd.props;

    const order = await this.ensureExistsOrder(orderId);

    order.updateStatus(OrderStatus.fromPrimitives(status));

    await this.repository.update(order);

    await this.publishEvents(order); // TODO: añadir consistencia y transaccionalidad
  }

  private async ensureExistsOrder(orderId: string): Promise<Order> {
    const order = await this.repository.findById(
      IdValueObject.fromPrimitives(orderId)
    );

    if (!order) {
      throw new NotFoundOrderError();
    }

    return order;
  }

  private async publishEvents(order: Order): Promise<void> {
    const events = order.pullDomainEvents();

    await this.eventBus.publishAll(events);
  }
}
