import type { DomainEvent } from './domain-event.interface';
import { DateValueObject } from './value-objects/date.value-object';
import type { IdValueObject } from './value-objects/id.value-object';
import type { NumberValueObject } from './value-objects/number.value-object';

export type RootAggregatePrimitives = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class RootAggregate<T> {
  protected static recordCreation<T extends RootAggregate<unknown>>(
    instance: T,
    creationEvent: DomainEvent
  ): T {
    instance.record(creationEvent);
    return instance;
  }

  abstract toPrimitives(): T;

  private domainEvents: Array<DomainEvent> = [];

  constructor(
    protected id: IdValueObject,
    protected version: NumberValueObject,
    protected createdAt: DateValueObject,
    protected updatedAt: DateValueObject
  ) {}

  getId(): string {
    return this.id.value;
  }

  getCreatedAt(): Date {
    return this.createdAt.value;
  }

  getUpdatedAt(): Date {
    return this.updatedAt.value;
  }

  update(): void {
    this.updatedAt = DateValueObject.now();
  }

  pullDomainEvents(): Array<DomainEvent> {
    const events = [...this.domainEvents];
    this.domainEvents = [];

    return events;
  }

  equals(other: RootAggregate<T>): boolean {
    return this.id.equals(other.id);
  }

  toString(): string {
    return JSON.stringify(this.toPrimitives(), null, 2);
  }

  protected record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
