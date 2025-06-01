import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import { IngredientMapper } from '@src/bounded-contexts/ingredients/application/ingredient.mapper';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { LogMethod } from '@src/bounded-contexts/shared/infraestructure/logger/decorators/log-method.decorator';

export class FinderIngredientById {
  constructor(private readonly repository: IngredientRepository) {}

  @LogMethod({
    logParams: true,
    logResult: true,
  })
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
