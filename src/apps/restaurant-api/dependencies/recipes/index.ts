import { FinderRecipeById } from '@src/bounded-contexts/recipes/application/finder-recipe-by-id/finder-recipe-by-id.use-case';
import { InMemoryRecipeRepository } from '@src/bounded-contexts/recipes/infraestructure/persistence/in-memory-recipe.repository';

import { dependencyContainer } from '../dependency-container';

// Repositories

const repository = new InMemoryRecipeRepository();

// Use Cases

const finderRecipeById = new FinderRecipeById(repository);

// Controllers

// Routes

// Registering the use cases in the dependency container

dependencyContainer.register('FinderRecipeById', () => finderRecipeById);
