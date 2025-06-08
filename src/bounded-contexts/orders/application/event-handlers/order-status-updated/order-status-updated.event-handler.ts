import { OrderStatusUpdatedEvent } from '@src/bounded-contexts/orders/domain/events/order-status-updated.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';

export class OrderStatusUpdatedEventHandler
  implements EventHandler<OrderStatusUpdatedEvent>
{
  constructor(private readonly logger: Logger) {}

  async handle(event: OrderStatusUpdatedEvent): Promise<void> {
    this.logger.info(event, 'OrderStatusUpdatedEventHandler');
  }

  getEventType(): string {
    return OrderStatusUpdatedEvent.EVENT_NAME;
  }
}
