import { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';

import type { Order, OrderPrimitives } from '../order.entity';

export class OrderCreatedEvent extends DomainEvent<OrderPrimitives> {
  static eventName(): string {
    return 'order.created';
  }

  static fromPrimitives(order: Order): OrderCreatedEvent {
    return new OrderCreatedEvent(order);
  }

  constructor(order: Order) {
    super('order.created', order.getId(), order.toPrimitives());
  }
}
