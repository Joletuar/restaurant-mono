import type { KitchenOrderReadModelRepository } from '@src/bounded-contexts/orders/application/read-models/kitchen-order-read-model.repository';
import { OrderMovedToInProgressEvent } from '@src/bounded-contexts/orders/domain/events/order-moved-to-in-progress.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class KitchenQueueOrderMovedToInProgressProjector
  implements EventHandler<OrderMovedToInProgressEvent>
{
  constructor(private readonly repository: KitchenOrderReadModelRepository) {}

  async handle(event: OrderMovedToInProgressEvent): Promise<void> {
    await this.repository.update(event.aggregateId, {
      status: event.payload.newStatus,
      startedAt: event.occurredOn,
    });
  }

  getEventType(): string {
    return OrderMovedToInProgressEvent.EVENT_NAME;
  }
}
