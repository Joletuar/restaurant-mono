import type { KitchenOrderReadModelRepository } from '@src/bounded-contexts/orders/application/read-models/kitchen-order-read-model.repository';
import { OrderCreatedEvent } from '@src/bounded-contexts/orders/domain/events/order-created.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class KitchenQueueOrderCreatedProjector
  implements EventHandler<OrderCreatedEvent>
{
  constructor(private readonly repository: KitchenOrderReadModelRepository) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    await this.repository.save({
      id: event.payload.id,
      orderId: event.payload.id,
      recipeId: event.payload.recipeId,
      status: event.payload.status,
      orderedAt: event.payload.createdAt,
      startedAt: null,
    });
  }

  getEventType(): string {
    return OrderCreatedEvent.EVENT_NAME;
  }
}
