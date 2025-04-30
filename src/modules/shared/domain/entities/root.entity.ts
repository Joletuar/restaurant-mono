import { DateValueObject } from '../value-objects/date.value-object';
import { IdValueObject } from '../value-objects/id.value-object';

export type RootEntityPrimitives = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class RootEntity<T> {
  abstract toPrimitives(): T;

  constructor(
    protected id: IdValueObject,
    protected createdAt: DateValueObject,
    protected updatedAt: DateValueObject
  ) {}

  toString(): string {
    return JSON.stringify(this.toPrimitives(), null, 2);
  }
}
