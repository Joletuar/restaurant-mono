import { FinderRecipeById } from '@src/bounded-contexts/recipes/application/finder-recipe-by-id/finder-recipe-by-id.use-case';
import { InMemoryRecipeRepository } from '@src/bounded-contexts/recipes/infraestructure/persistence/in-memory-recipe.repository';

import type { DependencyContainer } from '../dependency-container';

export const registerRecipesDependencies = (
  container: DependencyContainer
): void => {
  // Repositories

  const repository = new InMemoryRecipeRepository();

  container.register({
    key: 'FinderRepository',
    factory: () => repository,
  });

  // Use Cases

  const finderRecipeById = new FinderRecipeById(
    container.resolve('FinderRepository')
  );

  container.register({
    key: 'FinderRecipeById',
    factory: () => finderRecipeById,
  });

  // Controllers

  // Routes
};
