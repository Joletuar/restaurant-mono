import type { KitchenOrderReadModelRepository } from '@src/bounded-contexts/orders/application/read-models/kitchen-order-read-model.repository';
import { OrderCompletedEvent } from '@src/bounded-contexts/orders/domain/events/order-completed.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class KitchenQueueOrderCompletedProjector
  implements EventHandler<OrderCompletedEvent>
{
  constructor(private readonly repository: KitchenOrderReadModelRepository) {}

  async handle(event: OrderCompletedEvent): Promise<void> {
    await this.repository.delete(event.aggregateId);
  }

  getEventType(): string {
    return OrderCompletedEvent.EVENT_NAME;
  }
}
