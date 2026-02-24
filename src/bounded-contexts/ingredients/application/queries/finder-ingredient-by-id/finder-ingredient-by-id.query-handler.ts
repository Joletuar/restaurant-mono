import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import { IngredientMapper } from '@src/bounded-contexts/ingredients/application/ingredient.mapper';
import { IngredientNotFoundError } from '@src/bounded-contexts/ingredients/domain/errors/ingredient-not-found.error';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import type { FinderIngredientByIdQuery } from './finder-ingredient-by-id.query';

export class FinderIngredientByIdQueryHandler
  implements QueryHandler<FinderIngredientByIdQuery, IngredientDto>
{
  constructor(private readonly repository: IngredientRepository) {}

  async handle(
    query: FinderIngredientByIdQuery
  ): Promise<QueryResponse<IngredientDto>> {
    const { recipeId } = query;

    const ingredient = await this.repository.findById(
      IdValueObject.fromPrimitives(recipeId)
    );

    if (!ingredient) {
      throw new IngredientNotFoundError(recipeId);
    }

    return { data: IngredientMapper.toDto(ingredient) };
  }
}
