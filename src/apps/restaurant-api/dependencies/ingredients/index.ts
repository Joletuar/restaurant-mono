import { IngredientController } from '@src/apps/restaurant-api/http/rest-api/controllers/ingredient.controller';
import { CreatorIngredientCommand } from '@src/bounded-contexts/ingredients/application/commands/creator-ingredient/creator-ingredient.command';
import { CreatorIngredientCommandHandler } from '@src/bounded-contexts/ingredients/application/commands/creator-ingredient/creator-ingredient.command-handler';
import { IngredientCreatedReadModelProjector } from '@src/bounded-contexts/ingredients/application/event-handlers/ingredient-created.read-model.projector';
import { FinderIngredientByIdQuery } from '@src/bounded-contexts/ingredients/application/queries/finder-ingredient-by-id/finder-ingredient-by-id.query';
import { FinderIngredientByIdQueryHandler } from '@src/bounded-contexts/ingredients/application/queries/finder-ingredient-by-id/finder-ingredient-by-id.query-handler';
import { GetterAllIngredientsQuery } from '@src/bounded-contexts/ingredients/application/queries/getter-all-ingredients/getter-all-ingredients.query';
import { GetterAllIngredientsQueryHandler } from '@src/bounded-contexts/ingredients/application/queries/getter-all-ingredients/getter-all-ingredients.query-handler';
import { InMemoryIngredientRepository } from '@src/bounded-contexts/ingredients/infrastructure/persistence/in-memory-ingredient.repository';
import type { CommandBus } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { EventBus } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import { IngredientRouteRegistrar } from '../../http/rest-api/routes/ingredient.route';
import type { DependencyContainer } from '../dependency-container';

export const registerIngredientsDependencies = (
  container: DependencyContainer
): void => {
  // Repositories

  container.register({
    key: 'IngredientRepository',
    factory: () => new InMemoryIngredientRepository(),
    lifetime: 'singleton',
  });

  // Query Handlers

  container.register({
    key: 'FinderIngredientByIdQueryHandler',
    factory: () =>
      new FinderIngredientByIdQueryHandler(
        container.resolve('IngredientReadModelRepository')
      ),
  });

  container.register({
    key: 'GetterAllIngredientsQueryHandler',
    factory: () =>
      new GetterAllIngredientsQueryHandler(
        container.resolve('IngredientReadModelRepository')
      ),
  });

  const queryBus = container.resolve<QueryBus>('QueryBus');

  queryBus.register(
    FinderIngredientByIdQuery,
    container.resolve<FinderIngredientByIdQueryHandler>(
      'FinderIngredientByIdQueryHandler'
    )
  );

  queryBus.register(
    GetterAllIngredientsQuery,
    container.resolve<GetterAllIngredientsQueryHandler>(
      'GetterAllIngredientsQueryHandler'
    )
  );

  // Event Handlers

  container.register({
    key: 'IngredientCreatedReadModelProjector',
    factory: () =>
      new IngredientCreatedReadModelProjector(
        container.resolve('IngredientReadModelRepository')
      ),
  });

  const eventBus = container.resolve<EventBus>('EventBus');

  eventBus.subscribe(
    container.resolve<IngredientCreatedReadModelProjector>(
      'IngredientCreatedReadModelProjector'
    )
  );

  // Command Handlers

  container.register({
    key: 'CreatorIngredientCommandHandler',
    factory: () =>
      new CreatorIngredientCommandHandler(
        container.resolve('IngredientRepository'),
        container.resolve('EventBus'),
        container.resolve('EventStore')
      ),
  });

  const commandBus = container.resolve<CommandBus>('CommandBus');

  commandBus.register(
    CreatorIngredientCommand,
    container.resolve<CreatorIngredientCommandHandler>(
      'CreatorIngredientCommandHandler'
    )
  );

  // Controllers

  container.register({
    key: 'IngredientController',
    factory: () =>
      new IngredientController(
        container.resolve<QueryBus>('QueryBus'),
        container.resolve<CommandBus>('CommandBus')
      ),
  });

  // Routes

  container.register({
    key: 'IngredientRouteRegistrar',
    factory: () =>
      new IngredientRouteRegistrar(container.resolve('IngredientController')),
  });
};
