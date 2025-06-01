import type { QueryResponse } from '@src/bounded-contexts/shared/domain/query-bus.interface';

import type { RecipeDto } from '../../recipe.dto';

export interface FinderRecipeByIdQueryResponse
  extends QueryResponse<RecipeDto> {}
