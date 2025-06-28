import type { RecipeDto } from '@src/bounded-contexts/recipes/application/recipe.dto';
import { RecipeMapper } from '@src/bounded-contexts/recipes/application/recipe.mapper';
import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import type { FinderRecipeByIdQuery } from './finder-recipe-by-id.query';

export class FinderRecipeByIdQueryHandler
  implements QueryHandler<FinderRecipeByIdQuery, RecipeDto>
{
  constructor(private readonly repository: RecipeRepository) {}

  async handle(
    query: FinderRecipeByIdQuery
  ): Promise<QueryResponse<RecipeDto>> {
    const recipe = await this.repository.findById(
      IdValueObject.fromPrimitives(query.recipeId)
    );

    if (!recipe) {
      throw new NotFoundError('Recipe not found', [
        `Recipe with id <${query.recipeId}> not found.`,
      ]);
    }

    return { data: RecipeMapper.toDto(recipe) };
  }
}
