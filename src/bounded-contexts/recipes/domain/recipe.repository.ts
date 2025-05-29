import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import { Recipe } from './recipe.entity';

export interface RecipeRepository {
  findById(id: IdValueObject): Promise<Nullable<Recipe>>;
}
