import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import type { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import type { Ingredient } from './ingredient.entity';

export interface IngredientRepository {
  findById(id: IdValueObject): Promise<Nullable<Ingredient>>;

  getAll(): Promise<Ingredient[]>;
}
