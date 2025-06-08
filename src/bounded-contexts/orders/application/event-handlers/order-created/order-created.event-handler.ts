import { OrderCreatedEvent } from '@src/bounded-contexts/orders/domain/events/order-created.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';

export class OrderCreatedEventHandler
  implements EventHandler<OrderCreatedEvent>
{
  constructor(private readonly logger: Logger) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    this.logger.info(event, `Order created: `);
  }

  getEventType(): string {
    return OrderCreatedEvent.EVENT_NAME;
  }
}
