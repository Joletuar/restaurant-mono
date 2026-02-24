import type { OrderReadModelRepository } from '@src/bounded-contexts/orders/application/read-models/order-read-model.repository';
import { OrderCreatedEvent } from '@src/bounded-contexts/orders/domain/events/order-created.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class OrderCreatedReadModelProjector
  implements EventHandler<OrderCreatedEvent>
{
  constructor(private readonly repository: OrderReadModelRepository) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    await this.repository.save({
      id: event.payload.id,
      recipeId: event.payload.recipeId,
      status: event.payload.status,
      createdAt: event.payload.createdAt,
      updatedAt: event.payload.updatedAt,
    });
  }

  getEventType(): string {
    return OrderCreatedEvent.EVENT_NAME;
  }
}
