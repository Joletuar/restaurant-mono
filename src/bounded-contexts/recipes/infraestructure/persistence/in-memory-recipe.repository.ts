import { Recipe } from '@src/bounded-contexts/recipes/domain/recipe.entity';
import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infraestructure.error';
import { RootError } from '@src/bounded-contexts/shared/domain/errors/root.error';
import { LogLevel } from '@src/bounded-contexts/shared/domain/logger.interface';
import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { LogMethod } from '@src/bounded-contexts/shared/infraestructure/logger/decorators/log-method.decorator';

export class InMemoryRecipeRepository implements RecipeRepository {
  private recipes: Map<string, Recipe> = new Map<string, Recipe>();

  constructor(initialRecipes: Recipe[] = []) {
    initialRecipes.forEach((recipe) => {
      this.recipes.set(recipe.getId(), recipe);
    });
  }

  @LogMethod({
    level: LogLevel.INFO,
    logParams: true,
    logResult: true,
  })
  async findById(id: IdValueObject): Promise<Nullable<Recipe>> {
    try {
      const recipe = this.recipes.get(id.value);

      return recipe || null;
    } catch (error) {
      this.errorHandler(error);
      return null;
    }
  }

  errorHandler(error: unknown): void {
    if (error instanceof RootError) throw error;

    throw new InfrastructureError(
      'An unexpected error occurred in the Recipe Repository',
      [(error as Error)?.message || 'Unknown error.'],
      error instanceof Error ? error : undefined,
      true
    );
  }
}
