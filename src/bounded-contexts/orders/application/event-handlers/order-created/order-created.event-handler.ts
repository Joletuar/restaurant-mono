import { OrderCreatedEvent } from '@src/bounded-contexts/orders/domain/events/order-created.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class OrderCreatedEventHandler
  implements EventHandler<OrderCreatedEvent>
{
  async handle(event: OrderCreatedEvent): Promise<void> {
    console.log(`Order created: `, JSON.stringify(event, null, 2));
  }

  get eventType(): string {
    return OrderCreatedEvent.eventName();
  }
}
