import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import type { IngredientReadModelRepository } from '@src/bounded-contexts/ingredients/domain/read-models/ingredient-read-model.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { GetterAllIngredientsQuery } from './getter-all-ingredients.query';

export class GetterAllIngredientsQueryHandler
  implements QueryHandler<GetterAllIngredientsQuery, IngredientDto[]>
{
  constructor(private readonly repository: IngredientReadModelRepository) {}

  async handle(): Promise<QueryResponse<IngredientDto[]>> {
    const ingredients = await this.repository.getAll();

    return { data: ingredients };
  }
}
