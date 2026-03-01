import type { OrderStatsRepository } from '@src/bounded-contexts/orders/application/read-models/order-stats.repository';
import { OrderCancelledEvent } from '@src/bounded-contexts/orders/domain/events/order-cancelled.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class OrderCancelledStatsProjector
  implements EventHandler<OrderCancelledEvent>
{
  constructor(private readonly repository: OrderStatsRepository) {}

  async handle(): Promise<void> {
    const current = await this.repository.get();

    await this.repository.set({
      ...current,
      inProgressOrders:
        current.inProgressOrders > 0
          ? current.pendingOrders - 1
          : current.inProgressOrders,
      cancelledOrders: current.cancelledOrders + 1,
    });
  }

  getEventType(): string {
    return OrderCancelledEvent.EVENT_NAME;
  }
}
