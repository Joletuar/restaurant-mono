import { IngredientNotFoundError } from '@src/bounded-contexts/ingredients/domain/errors/ingredient-not-found.error';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import type { IngredientsExistenceChecker } from '@src/bounded-contexts/recipes/domain/services/ingredients-existence-checker.port';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class RecipeIngredientsExistenceChecker
  implements IngredientsExistenceChecker
{
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async ensureIngredientsExist(ids: string[]): Promise<void> {
    for (const id of ids) {
      const ingredient = await this.ingredientRepository.findById(
        IdValueObject.fromPrimitives(id)
      );

      if (!ingredient) {
        throw new IngredientNotFoundError(id);
      }
    }
  }
}
