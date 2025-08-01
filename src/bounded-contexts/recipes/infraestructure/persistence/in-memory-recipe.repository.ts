import { Recipe } from '@src/bounded-contexts/recipes/domain/recipe.entity';
import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infraestructure.error';
import { RootError } from '@src/bounded-contexts/shared/domain/errors/root.error';
import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { RootRespository } from '@src/bounded-contexts/shared/domain/root.repository';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class InMemoryRecipeRepository
  extends RootRespository
  implements RecipeRepository
{
  private recipes: Map<string, Recipe> = new Map<string, Recipe>();

  constructor(
    initialRecipes: Recipe[] = [
      Recipe.fromPrimitives({
        ingredientsIds: [IdValueObject.generateId().value],
      }),
    ]
  ) {
    super();

    initialRecipes.forEach((recipe) => {
      this.recipes.set(recipe.getId(), recipe);
    });
  }

  async findById(id: IdValueObject): Promise<Nullable<Recipe>> {
    try {
      const recipe = this.recipes.get(id.value);

      return recipe || null;
    } catch (error) {
      this.errorHandler(error);
      return null;
    }
  }

  async getAll(): Promise<Recipe[]> {
    try {
      return Array.from(this.recipes.values());
    } catch (error) {
      this.errorHandler(error);
      return [];
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
