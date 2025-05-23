import { IngredientRepository } from '@src/modules/ingredients/domain/ingredient.repository';
import { NotFoundError } from '@src/modules/shared/domain/errors/not-found.error';
import { IdValueObject } from '@src/modules/shared/domain/value-objects/id.value-object';

import { IngredientDto } from '../ingredient.dto';
import { IngredientMapper } from '../ingredient.mapper';

export class FinderIngredientById {
  constructor(private readonly repository: IngredientRepository) {}

  async execute(id: string): Promise<IngredientDto> {
    const ingredient = await this.repository.findById(
      IdValueObject.fromPrimitives(id)
    );

    if (!ingredient) {
      throw new NotFoundError('Ingredient not found', [
        `Ingredient with id <${id}> not found.`,
      ]);
    }

    return IngredientMapper.toDto(ingredient);
  }
}
