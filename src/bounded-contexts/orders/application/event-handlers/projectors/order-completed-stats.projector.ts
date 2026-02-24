import type { OrderStatsRepository } from '@src/bounded-contexts/orders/application/read-models/order-stats.repository';
import { OrderCompletedEvent } from '@src/bounded-contexts/orders/domain/events/order-completed.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class OrderCompletedStatsProjector
  implements EventHandler<OrderCompletedEvent>
{
  constructor(private readonly repository: OrderStatsRepository) {}

  async handle(): Promise<void> {
    const current = await this.repository.get();

    await this.repository.set({
      ...current,
      inProgressOrders:
        current.inProgressOrders > 0
          ? current.inProgressOrders - 1
          : current.inProgressOrders,
      completedOrders: current.completedOrders + 1,
    });
  }

  getEventType(): string {
    return OrderCompletedEvent.EVENT_NAME;
  }
}
