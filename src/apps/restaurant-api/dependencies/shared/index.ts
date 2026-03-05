import type { IngredientReadModel } from '@src/bounded-contexts/ingredients/application/read-models/ingredient.read-model';
import type { KitchenOrderReadModel } from '@src/bounded-contexts/orders/application/read-models/kitchen-order.read-model';
import type { OrderReadModel } from '@src/bounded-contexts/orders/application/read-models/order.read-model';
import { InMemoryOrderStatsRepository } from '@src/bounded-contexts/orders/infrastructure/read-models/in-memory-order-stats.repository';
import type { RecipeReadModel } from '@src/bounded-contexts/recipes/application/read-models/recipe.read-model';
import type { CommandBus } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';
import { InMemoryCommandBus } from '@src/bounded-contexts/shared/infrastructure/bus/command-bus/in-memory.command-bus';
import { LoggerCommandMiddleware } from '@src/bounded-contexts/shared/infrastructure/bus/command-bus/middlewares/logger.command-middleware';
import { EventEmitterEventBus } from '@src/bounded-contexts/shared/infrastructure/bus/event-bus/event-emitter.event-bus';
import { InMemoryQueryBus } from '@src/bounded-contexts/shared/infrastructure/bus/query-bus/in-memory.query-bus';
import { LoggerQueryMiddleware } from '@src/bounded-contexts/shared/infrastructure/bus/query-bus/middlewares/logger.query-middleware';
import { InMemoryEventStore } from '@src/bounded-contexts/shared/infrastructure/event-store/in-memory.event-store';
import { InMemoryReadModelRepository } from '@src/bounded-contexts/shared/infrastructure/read-model/in-memory.read-model.repository';

import type { DependencyContainer } from '../dependency-container';

export const registerSharedDependencies = (
  container: DependencyContainer
): void => {
  // Event Bus

  container.register({
    key: 'EventBus',
    lifetime: 'singleton',
    factory: () => new EventEmitterEventBus(),
  });

  // Command Bus

  container.register({
    key: 'CommandBus',
    lifetime: 'singleton',
    factory: () => new InMemoryCommandBus(),
  });

  const commandBus = container.resolve<CommandBus>('CommandBus');

  // Query Bus

  container.register({
    key: 'QueryBus',
    lifetime: 'singleton',
    factory: () => new InMemoryQueryBus(),
  });

  container.register({
    key: 'EventStore',
    lifetime: 'singleton',
    factory: () => new InMemoryEventStore(),
  });

  container.register({
    key: 'OrderReadModelRepository',
    lifetime: 'singleton',
    factory: () => new InMemoryReadModelRepository<OrderReadModel>(),
  });

  container.register({
    key: 'KitchenOrderReadModelRepository',
    lifetime: 'singleton',
    factory: () => new InMemoryReadModelRepository<KitchenOrderReadModel>(),
  });

  container.register({
    key: 'IngredientReadModelRepository',
    lifetime: 'singleton',
    factory: () => new InMemoryReadModelRepository<IngredientReadModel>(),
  });

  container.register({
    key: 'RecipeReadModelRepository',
    lifetime: 'singleton',
    factory: () => new InMemoryReadModelRepository<RecipeReadModel>(),
  });

  container.register({
    key: 'OrderStatsRepository',
    lifetime: 'singleton',
    factory: () => new InMemoryOrderStatsRepository(),
  });

  const queryBus = container.resolve<QueryBus>('QueryBus');

  const logger = container.resolve<Logger>('Logger');

  // Command and Query Middlewares

  container.register({
    key: 'LoggerQueryMiddleware',
    factory: () => new LoggerQueryMiddleware(logger),
  });

  container.register({
    key: 'LoggerCommandMiddleware',
    factory: () => new LoggerCommandMiddleware(logger),
  });

  queryBus.addMiddleware(container.resolve('LoggerQueryMiddleware'));
  commandBus.addMiddleware(container.resolve('LoggerCommandMiddleware'));
};
