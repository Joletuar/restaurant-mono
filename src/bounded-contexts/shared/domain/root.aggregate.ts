import { DateValueObject } from './value-objects/date.value-object';
import { IdValueObject } from './value-objects/id.value-object';

export type RootAggregatePrimitives = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class RootAggregate<T> {
  abstract toPrimitives(): T;

  private domainEvents: Array<unknown> = [];

  constructor(
    protected id: IdValueObject,
    protected createdAt: DateValueObject,
    protected updatedAt: DateValueObject
  ) {}

  protected record(event: unknown): void {
    this.domainEvents.push(event);
  }

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

  pullDomainEvents(): Array<unknown> {
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
}
