import type { OrderReadModelRepository } from '@src/bounded-contexts/orders/application/read-models/order-read-model.repository';
import { OrderStatusUpdatedEvent } from '@src/bounded-contexts/orders/domain/events/order-status-updated.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class OrderStatusUpdatedReadModelProjector
  implements EventHandler<OrderStatusUpdatedEvent>
{
  constructor(private readonly repository: OrderReadModelRepository) {}

  async handle(event: OrderStatusUpdatedEvent): Promise<void> {
    await this.repository.update(event.aggregateId, {
      status: event.payload.newStatus,
      updatedAt: event.occurredOn,
    });
  }

  getEventType(): string {
    return OrderStatusUpdatedEvent.EVENT_NAME;
  }
}
