import {
  Ingredient,
  type IngredientPrimivites,
} from '@src/bounded-contexts/ingredients/domain/ingredient.entity';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infrastructure.error';
import { RootError } from '@src/bounded-contexts/shared/domain/errors/root.error';
import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { RootRespository } from '@src/bounded-contexts/shared/domain/root.repository';
import type { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class InMemoryIngredientRepository
  extends RootRespository
  implements IngredientRepository
{
  private ingredients: Map<string, IngredientPrimivites> = new Map<
    string,
    IngredientPrimivites
  >();

  constructor(initialIngredients: Ingredient[] = []) {
    super();

    initialIngredients.forEach((ingredient) => {
      this.ingredients.set(ingredient.getId(), ingredient.toPrimitives());
    });
  }

  async findById(id: IdValueObject): Promise<Nullable<Ingredient>> {
    try {
      const ingredient = this.ingredients.get(id.value);

      return ingredient ? Ingredient.rehydrate(ingredient) : null;
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  async getAll(): Promise<Ingredient[]> {
    try {
      return Array.from(this.ingredients.values()).map((ingredient) =>
        Ingredient.rehydrate(ingredient)
      );
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  async create(ingredient: Ingredient): Promise<void> {
    try {
      this.ingredients.set(ingredient.getId(), ingredient.toPrimitives());
    } catch (error) {
      this.errorHandler(error);
    }
  }

  errorHandler(error: unknown): never {
    if (error instanceof RootError) throw error;

    throw new InfrastructureError(
      'An unexpected error occurred in the Ingredient Repository',
      error instanceof Error ? error : undefined,
      true
    );
  }
}
