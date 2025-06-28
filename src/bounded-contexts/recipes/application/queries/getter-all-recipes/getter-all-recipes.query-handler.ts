import type { RecipeDto } from '@src/bounded-contexts/recipes/application/recipe.dto';
import { RecipeMapper } from '@src/bounded-contexts/recipes/application/recipe.mapper';
import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { GetterAllRecipesQuery } from './getter-all-recipes.query';

export class GetterAllRecipesQueryHandler
  implements QueryHandler<GetterAllRecipesQuery, RecipeDto[]>
{
  constructor(private readonly repository: RecipeRepository) {}

  async handle(): Promise<QueryResponse<RecipeDto[]>> {
    const recipes = await this.repository.getAll();

    return { data: RecipeMapper.toDtoList(recipes) };
  }
}
