import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
import type { QueryHandler } from '@src/bounded-contexts/shared/domain/query-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import { RecipeMapper } from '../../recipe.mapper';
import type { FinderRecipeByIdQuery } from './finder-recipe-by-id.query';
import type { FinderRecipeByIdQueryResponse } from './finder-recipe-by-id.query-response';

export class FinderRecipeByIdQueryHandler
  implements QueryHandler<FinderRecipeByIdQuery, FinderRecipeByIdQueryResponse>
{
  constructor(private readonly repository: RecipeRepository) {}

  async handle(
    query: FinderRecipeByIdQuery
  ): Promise<FinderRecipeByIdQueryResponse> {
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
