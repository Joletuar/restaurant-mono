import { RecipeMapper } from '@src/bounded-contexts/recipes/application/recipe.mapper';
import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import type { QueryHandler } from '@src/bounded-contexts/shared/domain/query-bus.interface';

import type { GetterAllRecipesQuery } from './getter-all-recipes.query';
import type { GetterAllRecipesQueryResponse } from './getter-all-recipes.query-response';

export class GetterAllRecipesQueryHandler
  implements QueryHandler<GetterAllRecipesQuery, GetterAllRecipesQueryResponse>
{
  constructor(private readonly repository: RecipeRepository) {}

  async handle(
    query: GetterAllRecipesQuery
  ): Promise<GetterAllRecipesQueryResponse> {
    const recipes = await this.repository.getAll();

    return { data: RecipeMapper.toDtoList(recipes) };
  }
}
