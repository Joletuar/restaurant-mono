import { FinderIngredientById } from '@src/bounded-contexts/ingredients/application/finder-ingredient-by-id/finder-ingredient-by-id.use-case';
import { InMemoryIngredientRepository } from '@src/bounded-contexts/ingredients/infraestructure/persistence/in-memory-ingredient.repository';

import type { DependencyContainer } from '../dependency-container';

export const registerIngredientsDependencies = (
  container: DependencyContainer
): void => {
  // Repositories

  const repository = new InMemoryIngredientRepository();

  container.register({
    key: 'IngredientRepository',
    factory: () => repository,
  });

  // Use Cases

  const finderIngredientById = new FinderIngredientById(
    container.resolve('IngredientRepository')
  );

  container.register({
    key: 'FinderIngredientById',
    factory: () => finderIngredientById,
  });

  // Controllers

  // Routes
};
