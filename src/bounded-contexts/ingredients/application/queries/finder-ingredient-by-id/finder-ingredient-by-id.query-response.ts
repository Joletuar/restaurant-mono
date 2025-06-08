import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import type { QueryResponse } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

export interface FinderIngredientByIdQueryResponse
  extends QueryResponse<IngredientDto> {}
