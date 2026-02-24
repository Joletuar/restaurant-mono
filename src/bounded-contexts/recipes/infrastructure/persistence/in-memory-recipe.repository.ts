import {
  Recipe,
  type RecipePrimitives,
} from '@src/bounded-contexts/recipes/domain/recipe.entity';
import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infrastructure.error';
import { RootError } from '@src/bounded-contexts/shared/domain/errors/root.error';
import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { RootRespository } from '@src/bounded-contexts/shared/domain/root.repository';
import type { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class InMemoryRecipeRepository
  extends RootRespository
  implements RecipeRepository
{
  private recipes: Map<string, RecipePrimitives> = new Map<
    string,
    RecipePrimitives
  >();

  constructor(initialRecipes: Recipe[] = []) {
    super();

    initialRecipes.forEach((recipe) => {
      this.recipes.set(recipe.getId(), recipe.toPrimitives());
    });
  }

  async findById(id: IdValueObject): Promise<Nullable<Recipe>> {
    try {
      const recipe = this.recipes.get(id.value);

      return recipe ? Recipe.rehydrate(recipe) : null;
    } catch (error) {
      this.errorHandler(error);
      return null;
    }
  }

  async getAll(): Promise<Recipe[]> {
    try {
      return Array.from(this.recipes.values()).map((recipe) =>
        Recipe.rehydrate(recipe)
      );
    } catch (error) {
      this.errorHandler(error);
      return [];
    }
  }

  async create(recipe: Recipe): Promise<void> {
    try {
      this.recipes.set(recipe.getId(), recipe.toPrimitives());
    } catch (error) {
      this.errorHandler(error);
    }
  }

  errorHandler(error: unknown): void {
    if (error instanceof RootError) throw error;

    throw new InfrastructureError(
      'An unexpected error occurred in the Recipe Repository',
      error instanceof Error ? error : undefined,
      true
    );
  }
}
