export interface DomainEvent<TPayload = unknown> {
  readonly eventName: string;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: TPayload;
}
