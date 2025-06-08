import type { Query } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class FinderOrderByIdQuery implements Query {
  _id: string;

  _metadata?: Record<string, unknown> = {};

  constructor(
    readonly orderId: string,
    metadata?: Record<string, unknown>
  ) {
    this._metadata = metadata;

    this._id = IdValueObject.generateId().value;
  }
}
