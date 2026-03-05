import { RecipeController } from '@src/apps/restaurant-api/http/rest-api/controllers/recipe.controller';
import { RecipeRouteRegistrar } from '@src/apps/restaurant-api/http/rest-api/routes/recipe.route';
import { CreatorRecipeCommand } from '@src/bounded-contexts/recipes/application/commands/creator-recipe/creator-recipe.command';
import { CreatorRecipeCommandHandler } from '@src/bounded-contexts/recipes/application/commands/creator-recipe/creator-recipe.command-handler';
import { RecipeCreatedReadModelProjector } from '@src/bounded-contexts/recipes/application/event-handlers/recipe-created.read-model.projector';
import { FinderRecipeByIdQuery } from '@src/bounded-contexts/recipes/application/queries/finder-recipe-by-id/finder-recipe-by-id.query';
import { FinderRecipeByIdQueryHandler } from '@src/bounded-contexts/recipes/application/queries/finder-recipe-by-id/finder-recipe-by-id.query-handler';
import { GetterAllRecipesQuery } from '@src/bounded-contexts/recipes/application/queries/getter-all-recipes/getter-all-recipes.query';
import { GetterAllRecipesQueryHandler } from '@src/bounded-contexts/recipes/application/queries/getter-all-recipes/getter-all-recipes.query-handler';
import { RecipeIngredientsExistenceChecker } from '@src/bounded-contexts/recipes/application/services/recipe-ingredients-existence-checker.service';
import { InMemoryRecipeRepository } from '@src/bounded-contexts/recipes/infrastructure/persistence/in-memory-recipe.repository';
import type { CommandBus } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { EventBus } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

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

  container.register({
    key: 'RecipeIngredientsExistenceChecker',
    factory: () =>
      new RecipeIngredientsExistenceChecker(
        container.resolve('IngredientRepository')
      ),
  });

  // Query Handlers

  container.register({
    key: 'GetterAllRecipesQueryHandler',
    factory: () =>
      new GetterAllRecipesQueryHandler(
        container.resolve('RecipeReadModelRepository')
      ),
  });

  container.register({
    key: 'FinderRecipeByIdQueryHandler',
    factory: () =>
      new FinderRecipeByIdQueryHandler(
        container.resolve('RecipeReadModelRepository')
      ),
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

  // Event Handlers

  container.register({
    key: 'RecipeCreatedReadModelProjector',
    factory: () =>
      new RecipeCreatedReadModelProjector(
        container.resolve('RecipeReadModelRepository')
      ),
  });

  const eventBus = container.resolve<EventBus>('EventBus');

  eventBus.subscribe(
    container.resolve<RecipeCreatedReadModelProjector>(
      'RecipeCreatedReadModelProjector'
    )
  );

  // Command Handlers

  container.register({
    key: 'CreatorRecipeCommandHandler',
    factory: () =>
      new CreatorRecipeCommandHandler(
        container.resolve('RecipeRepository'),
        container.resolve('RecipeIngredientsExistenceChecker'),
        container.resolve('EventBus'),
        container.resolve('EventStore')
      ),
  });

  const commandBus = container.resolve<CommandBus>('CommandBus');

  commandBus.register(
    CreatorRecipeCommand,
    container.resolve<CreatorRecipeCommandHandler>(
      'CreatorRecipeCommandHandler'
    )
  );

  // Controllers

  container.register({
    key: 'RecipeController',
    factory: () =>
      new RecipeController(
        container.resolve('QueryBus'),
        container.resolve('CommandBus')
      ),
  });

  // Routes

  container.register({
    key: 'RecipeRouteRegistrar',
    factory: () =>
      new RecipeRouteRegistrar(container.resolve('RecipeController')),
  });
};
