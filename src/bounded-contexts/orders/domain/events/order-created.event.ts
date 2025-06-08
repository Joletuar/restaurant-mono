import { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';

import type { Order, OrderPrimitives } from '../order.entity';

export class OrderCreatedEvent extends DomainEvent<OrderPrimitives> {
  static readonly EVENT_NAME = 'order.created';
  static readonly EVENT_VERSION = 1;

  static fromPrimitives(order: Order): OrderCreatedEvent {
    return new OrderCreatedEvent(order);
  }

  constructor(order: Order) {
    super(
      OrderCreatedEvent.EVENT_NAME,
      order.getId(),
      OrderCreatedEvent.EVENT_VERSION,
      order.toPrimitives()
    );
  }
}
