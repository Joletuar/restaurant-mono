import type { RecipeExistenceChecker } from '@src/bounded-contexts/orders/domain/services/recipe-existence-checker.port';
import { RecipeNotFoundError } from '@src/bounded-contexts/recipes/domain/errors/recipe-not-found.error';
import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class OrderRecipeExistenceChecker implements RecipeExistenceChecker {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async ensureRecipeExists(recipeId: string): Promise<void> {
    const recipe = await this.recipeRepository.findById(
      IdValueObject.fromPrimitives(recipeId)
    );

    if (!recipe) {
      throw new RecipeNotFoundError(recipeId);
    }
  }
}
