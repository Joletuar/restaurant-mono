import type { RecipeDto } from '@src/bounded-contexts/recipes/application/recipe.dto';
import type { QueryResponse } from '@src/bounded-contexts/shared/domain/query-bus.interface';

export interface GetterAllRecipesQueryResponse
  extends QueryResponse<RecipeDto[]> {}
