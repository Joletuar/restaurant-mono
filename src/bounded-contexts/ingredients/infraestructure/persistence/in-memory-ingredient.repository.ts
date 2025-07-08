import type { Ingredient } from '@src/bounded-contexts/ingredients/domain/ingredient.entity';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infraestructure.error';
import { RootError } from '@src/bounded-contexts/shared/domain/errors/root.error';
import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { RootRespository } from '@src/bounded-contexts/shared/domain/root.repository';
import type { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class InMemoryIngredientRepository
  extends RootRespository
  implements IngredientRepository
{
  private ingredients: Map<string, Ingredient> = new Map<string, Ingredient>();

  constructor(initialIngredients: Ingredient[] = []) {
    super();

    initialIngredients.forEach((ingredient) => {
      this.ingredients.set(ingredient.getId(), ingredient);
    });
  }

  async findById(id: IdValueObject): Promise<Nullable<Ingredient>> {
    try {
      const ingredient = this.ingredients.get(id.value);

      return ingredient || null;
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  async findAll(): Promise<Ingredient[]> {
    try {
      return Array.from(this.ingredients.values());
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  errorHandler(error: unknown): never {
    if (error instanceof RootError) throw error;

    throw new InfrastructureError(
      'An unexpected error occurred in the Ingredient Repository',
      [(error as Error)?.message || 'Unknown error'],
      error instanceof Error ? error : undefined,
      true
    );
  }
}
