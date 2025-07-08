import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import { IngredientMapper } from '@src/bounded-contexts/ingredients/application/ingredient.mapper';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { GetterAllIngredientsQuery } from './getter-all-ingredients.query';

export class GetterAllIngredientsQueryHandler
  implements QueryHandler<GetterAllIngredientsQuery, IngredientDto[]>
{
  constructor(private readonly repository: IngredientRepository) {}

  async handle(): Promise<QueryResponse<IngredientDto[]>> {
    const ingredients = await this.repository.getAll();

    return { data: IngredientMapper.toDtos(ingredients) };
  }
}
