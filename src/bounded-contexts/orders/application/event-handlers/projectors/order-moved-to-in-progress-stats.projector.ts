import type { OrderStatsRepository } from '@src/bounded-contexts/orders/application/read-models/order-stats.repository';
import { OrderMovedToInProgressEvent } from '@src/bounded-contexts/orders/domain/events/order-moved-to-in-progress.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class OrderMovedToInProgressStatsProjector
  implements EventHandler<OrderMovedToInProgressEvent>
{
  constructor(private readonly repository: OrderStatsRepository) {}

  async handle(): Promise<void> {
    const current = await this.repository.get();

    await this.repository.set({
      ...current,
      pendingOrders:
        current.pendingOrders > 0
          ? current.pendingOrders - 1
          : current.pendingOrders,
      inProgressOrders: current.inProgressOrders + 1,
    });
  }

  getEventType(): string {
    return OrderMovedToInProgressEvent.EVENT_NAME;
  }
}
