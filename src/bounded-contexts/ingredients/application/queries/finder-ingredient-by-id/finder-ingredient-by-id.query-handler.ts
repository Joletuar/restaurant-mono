import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import { IngredientNotFoundError } from '@src/bounded-contexts/ingredients/domain/errors/ingredient-not-found.error';
import type { IngredientReadModelRepository } from '@src/bounded-contexts/ingredients/domain/read-models/ingredient-read-model.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { FinderIngredientByIdQuery } from './finder-ingredient-by-id.query';

export class FinderIngredientByIdQueryHandler
  implements QueryHandler<FinderIngredientByIdQuery, IngredientDto>
{
  constructor(private readonly repository: IngredientReadModelRepository) {}

  async handle(
    query: FinderIngredientByIdQuery
  ): Promise<QueryResponse<IngredientDto>> {
    const { recipeId } = query;

    const ingredient = await this.repository.findById(recipeId);

    if (!ingredient) {
      throw new IngredientNotFoundError(recipeId);
    }

    return { data: ingredient };
  }
}
