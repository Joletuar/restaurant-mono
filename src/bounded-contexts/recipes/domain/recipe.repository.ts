import { Nullable } from '@src/modules/shared/domain/nullable.type';
import { IdValueObject } from '@src/modules/shared/domain/value-objects/id.value-object';

import { Recipe } from './recipe.entity';

export interface RecipeRepository {
  findById(id: IdValueObject): Promise<Nullable<Recipe>>;
}
