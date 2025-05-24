import { FinderIngredientById } from '@src/bounded-contexts/ingredients/application/finder-ingredient-by-id/finder-ingredient-by-id.use-case';
import { InMemoryIngredientRepository } from '@src/bounded-contexts/ingredients/infraestructure/persistence/in-memory-ingredient.repository';

import { dependencyContainer } from '../dependency-container';

// Repositories

const repository = new InMemoryIngredientRepository();

dependencyContainer.register('IngredientRepository', () => repository);

// Use Cases

const finderIngredientById = new FinderIngredientById(
  dependencyContainer.resolve('IngredientRepository')
);

dependencyContainer.register(
  'FinderIngredientById',
  () => finderIngredientById
);

// Controllers

// Routes
