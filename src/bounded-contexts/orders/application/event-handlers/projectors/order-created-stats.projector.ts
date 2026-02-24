import type { OrderStatsRepository } from '@src/bounded-contexts/orders/application/read-models/order-stats.repository';
import { OrderCreatedEvent } from '@src/bounded-contexts/orders/domain/events/order-created.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class OrderCreatedStatsProjector
  implements EventHandler<OrderCreatedEvent>
{
  constructor(private readonly repository: OrderStatsRepository) {}

  async handle(): Promise<void> {
    const current = await this.repository.get();

    await this.repository.set({
      ...current,
      totalOrders: current.totalOrders + 1,
      pendingOrders: current.pendingOrders + 1,
    });
  }

  getEventType(): string {
    return OrderCreatedEvent.EVENT_NAME;
  }
}
