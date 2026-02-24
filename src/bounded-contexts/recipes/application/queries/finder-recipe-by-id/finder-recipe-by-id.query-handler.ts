import type { RecipeReadModelRepository } from '@src/bounded-contexts/recipes/application/read-models/recipe-read-model.repository';
import type { RecipeDto } from '@src/bounded-contexts/recipes/application/recipe.dto';
import { RecipeNotFoundError } from '@src/bounded-contexts/recipes/domain/errors/recipe-not-found.error';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { FinderRecipeByIdQuery } from './finder-recipe-by-id.query';

export class FinderRecipeByIdQueryHandler
  implements QueryHandler<FinderRecipeByIdQuery, RecipeDto>
{
  constructor(private readonly repository: RecipeReadModelRepository) {}

  async handle(
    query: FinderRecipeByIdQuery
  ): Promise<QueryResponse<RecipeDto>> {
    const recipe = await this.repository.findById(query.recipeId);

    if (!recipe) {
      throw new RecipeNotFoundError(query.recipeId);
    }

    return { data: recipe };
  }
}
