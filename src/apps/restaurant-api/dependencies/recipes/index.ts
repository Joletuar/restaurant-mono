import { RecipeController } from '@src/apps/restaurant-api/http/rest-api/controllers/recipe.controller';
import { RecipeRouteRegistrar } from '@src/apps/restaurant-api/http/rest-api/routes/recipe.route';
import { FinderRecipeByIdQuery } from '@src/bounded-contexts/recipes/application/queries/finder-recipe-by-id/finder-recipe-by-id.query';
import { FinderRecipeByIdQueryHandler } from '@src/bounded-contexts/recipes/application/queries/finder-recipe-by-id/finder-recipe-by-id.query-handler';
import { GetterAllRecipesQuery } from '@src/bounded-contexts/recipes/application/queries/getter-all-recipes/getter-all-recipes.query';
import { GetterAllRecipesQueryHandler } from '@src/bounded-contexts/recipes/application/queries/getter-all-recipes/getter-all-recipes.query-handler';
import { FinderRecipeById } from '@src/bounded-contexts/recipes/application/use-cases/finder-recipe-by-id/finder-recipe-by-id.use-case';
import { InMemoryRecipeRepository } from '@src/bounded-contexts/recipes/infraestructure/persistence/in-memory-recipe.repository';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/query-bus.interface';

import type { DependencyContainer } from '../dependency-container';

export const registerRecipesDependencies = (
  container: DependencyContainer
): void => {
  // Repositories

  container.register({
    key: 'RecipeRepository',
    factory: () => new InMemoryRecipeRepository(),
    lifetime: 'singleton',
  });

  // Use Cases

  container.register({
    key: 'FinderRecipeById',
    factory: () => new FinderRecipeById(container.resolve('FinderRepository')),
  });

  // Query Handlers

  container.register({
    key: 'GetterAllRecipesQueryHandler',
    factory: () =>
      new GetterAllRecipesQueryHandler(container.resolve('RecipeRepository')),
  });

  container.register({
    key: 'FinderRecipeByIdQueryHandler',
    factory: () =>
      new FinderRecipeByIdQueryHandler(container.resolve('RecipeRepository')),
  });

  const queryBus = container.resolve<QueryBus>('QueryBus');

  queryBus.register(
    GetterAllRecipesQuery,
    container.resolve<GetterAllRecipesQueryHandler>(
      'GetterAllRecipesQueryHandler'
    )
  );

  queryBus.register(
    FinderRecipeByIdQuery,
    container.resolve<FinderRecipeByIdQueryHandler>(
      'FinderRecipeByIdQueryHandler'
    )
  );

  // Controllers

  container.register({
    key: 'RecipeController',
    factory: () => new RecipeController(container.resolve('QueryBus')),
  });

  // Routes

  container.register({
    key: 'RecipeRouteRegistrar',
    factory: () =>
      new RecipeRouteRegistrar(container.resolve('RecipeController')),
  });
};
