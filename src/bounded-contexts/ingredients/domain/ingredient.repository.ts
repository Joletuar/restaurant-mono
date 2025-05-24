import { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import { Ingredient } from './ingredient.entity';

export interface IngredientRepository {
  findById(id: IdValueObject): Promise<Nullable<Ingredient>>;
}
