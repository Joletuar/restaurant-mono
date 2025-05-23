import { Nullable } from '@src/modules/shared/domain/nullable.type';
import { IdValueObject } from '@src/modules/shared/domain/value-objects/id.value-object';

import { Ingredient } from './ingredient.entity';

export interface IngredientRepository {
  findById(id: IdValueObject): Promise<Nullable<Ingredient>>;
}
