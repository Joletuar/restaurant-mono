import { EventEmitter } from 'events';

import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';

export class EventEmitterEventBus {
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    this.emitter.emit(event.eventName, event);
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  subscribe<T extends DomainEvent>(handler: EventHandler<T>): void {
    this.emitter.on(handler.getEventType(), async (event: T) => {
      await handler.handle(event);
    });
  }

  unsubscribe<T extends DomainEvent>(handler: EventHandler<T>): void {
    this.emitter.off(handler.getEventType(), handler.handle);
  }
}
