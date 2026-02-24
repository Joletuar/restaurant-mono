import type { KitchenOrderReadModelRepository } from '@src/bounded-contexts/orders/application/read-models/kitchen-order-read-model.repository';
import { OrderCancelledEvent } from '@src/bounded-contexts/orders/domain/events/order-cancelled.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class KitchenQueueOrderCancelledProjector
  implements EventHandler<OrderCancelledEvent>
{
  constructor(private readonly repository: KitchenOrderReadModelRepository) {}

  async handle(event: OrderCancelledEvent): Promise<void> {
    await this.repository.delete(event.aggregateId);
  }

  getEventType(): string {
    return OrderCancelledEvent.EVENT_NAME;
  }
}
