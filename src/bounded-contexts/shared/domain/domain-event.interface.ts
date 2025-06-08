import { IdValueObject } from './value-objects/id.value-object';

export abstract class DomainEvent<TPayload = unknown> {
  readonly eventId: string;
  readonly occurredOn: Date;

  constructor(
    readonly eventName: string,
    readonly aggregateId: string,
    readonly eventVersion: number,
    readonly payload: TPayload
  ) {
    this.eventId = IdValueObject.generateId().value;
    this.occurredOn = new Date();
  }
}
