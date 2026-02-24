import type { RecipeReadModelRepository } from '@src/bounded-contexts/recipes/application/read-models/recipe-read-model.repository';
import type { RecipeDto } from '@src/bounded-contexts/recipes/application/recipe.dto';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { GetterAllRecipesQuery } from './getter-all-recipes.query';

export class GetterAllRecipesQueryHandler
  implements QueryHandler<GetterAllRecipesQuery, RecipeDto[]>
{
  constructor(private readonly repository: RecipeReadModelRepository) {}

  async handle(): Promise<QueryResponse<RecipeDto[]>> {
    const recipes = await this.repository.getAll();

    return { data: recipes };
  }
}
