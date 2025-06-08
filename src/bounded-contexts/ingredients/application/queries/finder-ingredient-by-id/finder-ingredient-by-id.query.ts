import type { Query } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class FinderIngredientByIdQuery implements Query {
  static fromPrimitives(recipeId: string): FinderIngredientByIdQuery {
    return new FinderIngredientByIdQuery(recipeId);
  }

  readonly _id: string = IdValueObject.generateId().value;

  constructor(readonly recipeId: string) {}
}
