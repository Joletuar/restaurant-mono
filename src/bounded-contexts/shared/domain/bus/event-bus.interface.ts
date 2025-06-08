import type { DomainEvent } from '../domain-event.interface';

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;

  getEventType(): string;
}

export interface EventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;

  publishAll(events: DomainEvent[]): Promise<void>;

  subscribe<T extends DomainEvent>(handler: EventHandler<T>): void;

  unsubscribe<T extends DomainEvent>(handler: EventHandler<T>): void;
}
