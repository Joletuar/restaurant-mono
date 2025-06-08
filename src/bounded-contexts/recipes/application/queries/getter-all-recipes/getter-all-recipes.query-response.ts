import type { RecipeDto } from '@src/bounded-contexts/recipes/application/recipe.dto';
import type { QueryResponse } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

export interface GetterAllRecipesQueryResponse
  extends QueryResponse<RecipeDto[]> {}
