import { Ingredient } from '@src/bounded-contexts/ingredients/domain/ingredient.entity';
import { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infraestructure.error';
import { RootError } from '@src/bounded-contexts/shared/domain/errors/root.error';
import { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class InMemoryIngredientRepository implements IngredientRepository {
  private ingredients: Map<string, Ingredient> = new Map<string, Ingredient>();

  constructor(initialIngredients: Ingredient[] = []) {
    initialIngredients.forEach((ingredient) => {
      this.ingredients.set(ingredient.getId(), ingredient);
    });
  }

  async findById(id: IdValueObject): Promise<Nullable<Ingredient>> {
    try {
      const ingredient = this.ingredients.get(id.value);

      return ingredient || null;
    } catch (error) {
      this.errorHandler(error);
      return null;
    }
  }

  errorHandler(error: unknown): void {
    if (error instanceof RootError) throw error;

    throw new InfrastructureError(
      'An unexpected error occurred in the Ingredient Repository',
      [(error as Error)?.message || 'Unknown error'],
      error instanceof Error ? error : undefined,
      true
    );
  }
}
