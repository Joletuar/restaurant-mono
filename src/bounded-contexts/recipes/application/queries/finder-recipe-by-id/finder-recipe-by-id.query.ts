import type { Query } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class FinderRecipeByIdQuery implements Query {
  _id: string;
  constructor(
    readonly recipeId: string,
    readonly _metadata: Record<string, unknown> = {}
  ) {
    this._id = IdValueObject.generateId().value;
  }
}
