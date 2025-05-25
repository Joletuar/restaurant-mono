import { DomainEvent } from './domain-event.interface';

export type EventHandler<TPayload> = (
  event: DomainEvent<TPayload>
) => Promise<void> | void;

export interface EventBus {
  publish<TPayload>(events: DomainEvent<TPayload>[]): Promise<void>;
  subscribe<TPayload>(eventName: string, handler: EventHandler<TPayload>): void;
}
