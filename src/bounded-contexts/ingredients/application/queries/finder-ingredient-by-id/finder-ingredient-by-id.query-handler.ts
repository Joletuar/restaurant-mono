import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import { IngredientMapper } from '@src/bounded-contexts/ingredients/application/ingredient.mapper';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
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
      throw new NotFoundError('Ingredient not found', [
        `Ingredient with id <${recipeId}> not found.`,
      ]);
    }

    return { data: IngredientMapper.toDto(ingredient) };
  }
}
