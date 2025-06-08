import type { DomainEvent } from './domain-event.interface';

export interface EventStore {
  saveEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void>;

  getEvents(aggregateId: string): Promise<DomainEvent[]>;

  getAllEvents(): Promise<DomainEvent[]>;
}
