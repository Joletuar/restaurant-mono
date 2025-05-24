import { FinderIngredientById } from '@src/bounded-contexts/ingredients/application/finder-ingredient-by-id/finder-ingredient-by-id.use-case';
import { InMemoryIngredientRepository } from '@src/bounded-contexts/ingredients/infraestructure/persistence/in-memory-ingredient.repository';

import { dependencyContainer } from '../dependency-container';

// Repositories

const repository = new InMemoryIngredientRepository();

// Use Cases

const finderIngredientById = new FinderIngredientById(repository);

// Controllers

// Routes

// Registering the use cases in the dependency container

dependencyContainer.register(
  'FinderIngredientById',
  () => finderIngredientById
);
