import type { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';
import type { EventStore } from '@src/bounded-contexts/shared/domain/event-store.interface';

export class InMemoryEventStore implements EventStore {
  private readonly events: Record<string, DomainEvent[]> = {};

  async saveEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void> {
    const existingEvents = this.events[aggregateId] || [];

    const currentVersion =
      existingEvents.length > 0
        ? existingEvents[existingEvents.length - 1]!.eventVersion
        : 0;

    if (currentVersion !== expectedVersion) {
      throw new Error(
        `Version conflict for the aggregate ${aggregateId}. Expected: ${expectedVersion}, current: ${currentVersion}`
      );
    }

    if (!this.events[aggregateId]) {
      this.events[aggregateId] = [];
    }

    this.events[aggregateId].push(...events);
  }

  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    return [...(this.events[aggregateId] || [])];
  }

  async getAllEvents(): Promise<DomainEvent[]> {
    return Object.values(this.events).flat();
  }
}
