import type {
  EventBus,
  EventHandler,
} from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';

export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const eventType = event.eventName;
    const handlers = this.handlers.get(eventType) || [];

    const promises = handlers.map((handler) => handler.handle(event));
    await Promise.all(promises);
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  subscribe<T extends DomainEvent>(handler: EventHandler<T>): void {
    const eventType = handler.getEventType();
    const handlers = this.handlers.get(eventType) || [];

    handlers.push(handler);

    this.handlers.set(eventType, handlers);
  }

  unsubscribe<T extends DomainEvent>(handler: EventHandler<T>): void {
    const eventType = handler.getEventType();
    const handlers = this.handlers.get(eventType) || [];
    const index = handlers.indexOf(handler);

    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }
}
