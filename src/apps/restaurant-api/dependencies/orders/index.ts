import { KitchenController } from '@src/apps/restaurant-api/http/rest-api/controllers/kitchen.controller';
import { OrderController } from '@src/apps/restaurant-api/http/rest-api/controllers/order.controller';
import { KitchenRouteRegistrar } from '@src/apps/restaurant-api/http/rest-api/routes/kitchen.route';
import { OrderRouteRegistrar } from '@src/apps/restaurant-api/http/rest-api/routes/order.route';
import { CreatorOrderCommand } from '@src/bounded-contexts/orders/application/commands/creator-order/creator-order.command';
import { CreatorOrderCommandHandler } from '@src/bounded-contexts/orders/application/commands/creator-order/creator-order.command-handler';
import { UpdaterOrderByIdCommand } from '@src/bounded-contexts/orders/application/commands/updater-order-by-id/updater-order-by-id.command';
import { UpdaterOrderByIdCommandHandler } from '@src/bounded-contexts/orders/application/commands/updater-order-by-id/updater-order-by-id.command-handler';
import { KitchenQueueOrderCancelledProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/kitchen-queue-order-cancelled.projector';
import { KitchenQueueOrderCompletedProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/kitchen-queue-order-completed.projector';
import { KitchenQueueOrderCreatedProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/kitchen-queue-order-created.projector';
import { KitchenQueueOrderMovedToInProgressProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/kitchen-queue-order-moved-to-in-progress.projector';
import { OrderCancelledStatsProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/order-cancelled-stats.projector';
import { OrderCompletedStatsProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/order-completed-stats.projector';
import { OrderCreatedStatsProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/order-created-stats.projector';
import { OrderCreatedReadModelProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/order-created.read-model.projector';
import { OrderMovedToInProgressStatsProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/order-moved-to-in-progress-stats.projector';
import { OrderStatusUpdatedReadModelProjector } from '@src/bounded-contexts/orders/application/event-handlers/projectors/order-status-updated.read-model.projector';
import { FinderOrderByIdQuery } from '@src/bounded-contexts/orders/application/queries/finder-order-by-id/finder-order-by-id.query';
import { FinderOrderByIdQueryHandler } from '@src/bounded-contexts/orders/application/queries/finder-order-by-id/finder-order-by-id.query-handler';
import { GetterAllOrdersQuery } from '@src/bounded-contexts/orders/application/queries/getter-all-orders/getter-all-orders.query';
import { GetterAllOrdersQueryHandler } from '@src/bounded-contexts/orders/application/queries/getter-all-orders/getter-all-orders.query-handler';
import { GetterKitchenQueueQuery } from '@src/bounded-contexts/orders/application/queries/getter-kitchen-queue/getter-kitchen-queue.query';
import { GetterKitchenQueueQueryHandler } from '@src/bounded-contexts/orders/application/queries/getter-kitchen-queue/getter-kitchen-queue.query-handler';
import { GetterOrderStatsQuery } from '@src/bounded-contexts/orders/application/queries/getter-order-stats/getter-order-stats.query';
import { GetterOrderStatsQueryHandler } from '@src/bounded-contexts/orders/application/queries/getter-order-stats/getter-order-stats.query-handler';
import { OrderRecipeExistenceChecker } from '@src/bounded-contexts/orders/application/services/order-recipe-existence-checker.service';
import { InMemoryOrderRepository } from '@src/bounded-contexts/orders/infrastructure/persistence/in-memory-order.repository';
import type { CommandBus } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { EventBus } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { DependencyContainer } from '../dependency-container';

export const registerOrderDependencies = (
  container: DependencyContainer
): void => {
  // Repositories

  container.register({
    key: 'OrderRepository',
    factory: () => new InMemoryOrderRepository(),
    lifetime: 'singleton',
  });

  container.register({
    key: 'OrderRecipeExistenceChecker',
    factory: () =>
      new OrderRecipeExistenceChecker(container.resolve('RecipeRepository')),
  });

  //  Query Handlers

  container.register({
    key: 'GetterAllOrdersQueryHandler',
    factory: () =>
      new GetterAllOrdersQueryHandler(
        container.resolve('OrderReadModelRepository')
      ),
  });

  container.register({
    key: 'FinderOrderByIdQueryHandler',
    factory: () =>
      new FinderOrderByIdQueryHandler(
        container.resolve('OrderReadModelRepository')
      ),
  });

  container.register({
    key: 'GetterKitchenQueueQueryHandler',
    factory: () =>
      new GetterKitchenQueueQueryHandler(
        container.resolve('KitchenOrderReadModelRepository')
      ),
  });

  container.register({
    key: 'GetterOrderStatsQueryHandler',
    factory: () =>
      new GetterOrderStatsQueryHandler(
        container.resolve('OrderStatsRepository')
      ),
  });

  const queryBus = container.resolve<QueryBus>('QueryBus');

  queryBus.register(
    GetterAllOrdersQuery,
    container.resolve<GetterAllOrdersQueryHandler>(
      'GetterAllOrdersQueryHandler'
    )
  );

  queryBus.register(
    FinderOrderByIdQuery,
    container.resolve<FinderOrderByIdQueryHandler>(
      'FinderOrderByIdQueryHandler'
    )
  );

  queryBus.register(
    GetterKitchenQueueQuery,
    container.resolve<GetterKitchenQueueQueryHandler>(
      'GetterKitchenQueueQueryHandler'
    )
  );

  queryBus.register(
    GetterOrderStatsQuery,
    container.resolve<GetterOrderStatsQueryHandler>(
      'GetterOrderStatsQueryHandler'
    )
  );

  // Event Handlers

  container.register({
    key: 'OrderCreatedReadModelProjector',
    factory: () =>
      new OrderCreatedReadModelProjector(
        container.resolve('OrderReadModelRepository')
      ),
  });

  container.register({
    key: 'OrderStatusUpdatedReadModelProjector',
    factory: () =>
      new OrderStatusUpdatedReadModelProjector(
        container.resolve('OrderReadModelRepository')
      ),
  });

  container.register({
    key: 'KitchenQueueOrderCreatedProjector',
    factory: () =>
      new KitchenQueueOrderCreatedProjector(
        container.resolve('KitchenOrderReadModelRepository')
      ),
  });

  container.register({
    key: 'KitchenQueueOrderMovedToInProgressProjector',
    factory: () =>
      new KitchenQueueOrderMovedToInProgressProjector(
        container.resolve('KitchenOrderReadModelRepository')
      ),
  });

  container.register({
    key: 'KitchenQueueOrderCompletedProjector',
    factory: () =>
      new KitchenQueueOrderCompletedProjector(
        container.resolve('KitchenOrderReadModelRepository')
      ),
  });

  container.register({
    key: 'KitchenQueueOrderCancelledProjector',
    factory: () =>
      new KitchenQueueOrderCancelledProjector(
        container.resolve('KitchenOrderReadModelRepository')
      ),
  });

  container.register({
    key: 'OrderCreatedStatsProjector',
    factory: () =>
      new OrderCreatedStatsProjector(container.resolve('OrderStatsRepository')),
  });

  container.register({
    key: 'OrderMovedToInProgressStatsProjector',
    factory: () =>
      new OrderMovedToInProgressStatsProjector(
        container.resolve('OrderStatsRepository')
      ),
  });

  container.register({
    key: 'OrderCompletedStatsProjector',
    factory: () =>
      new OrderCompletedStatsProjector(
        container.resolve('OrderStatsRepository')
      ),
  });

  container.register({
    key: 'OrderCancelledStatsProjector',
    factory: () =>
      new OrderCancelledStatsProjector(
        container.resolve('OrderStatsRepository')
      ),
  });

  const eventBus = container.resolve<EventBus>('EventBus');

  eventBus.subscribe(
    container.resolve<OrderCreatedReadModelProjector>(
      'OrderCreatedReadModelProjector'
    )
  );

  eventBus.subscribe(
    container.resolve<OrderStatusUpdatedReadModelProjector>(
      'OrderStatusUpdatedReadModelProjector'
    )
  );

  eventBus.subscribe(
    container.resolve<KitchenQueueOrderCreatedProjector>(
      'KitchenQueueOrderCreatedProjector'
    )
  );

  eventBus.subscribe(
    container.resolve<KitchenQueueOrderMovedToInProgressProjector>(
      'KitchenQueueOrderMovedToInProgressProjector'
    )
  );

  eventBus.subscribe(
    container.resolve<KitchenQueueOrderCompletedProjector>(
      'KitchenQueueOrderCompletedProjector'
    )
  );

  eventBus.subscribe(
    container.resolve<KitchenQueueOrderCancelledProjector>(
      'KitchenQueueOrderCancelledProjector'
    )
  );

  eventBus.subscribe(
    container.resolve<OrderCreatedStatsProjector>('OrderCreatedStatsProjector')
  );

  eventBus.subscribe(
    container.resolve<OrderMovedToInProgressStatsProjector>(
      'OrderMovedToInProgressStatsProjector'
    )
  );

  eventBus.subscribe(
    container.resolve<OrderCompletedStatsProjector>(
      'OrderCompletedStatsProjector'
    )
  );

  eventBus.subscribe(
    container.resolve<OrderCancelledStatsProjector>(
      'OrderCancelledStatsProjector'
    )
  );

  // Command Handlers

  container.register({
    key: 'CreatorOrderCommandHandler',
    factory: () =>
      new CreatorOrderCommandHandler(
        container.resolve('OrderRepository'),
        container.resolve('OrderRecipeExistenceChecker'),
        eventBus,
        container.resolve('EventStore')
      ),
  });

  container.register({
    key: 'UpdaterOrderByIdCommandHandler',
    factory: () =>
      new UpdaterOrderByIdCommandHandler(
        container.resolve('OrderRepository'),
        container.resolve('EventBus'),
        container.resolve('EventStore')
      ),
  });

  const commandBus = container.resolve<CommandBus>('CommandBus');

  commandBus.register(
    CreatorOrderCommand,
    container.resolve<CreatorOrderCommandHandler>('CreatorOrderCommandHandler')
  );

  commandBus.register(
    UpdaterOrderByIdCommand,
    container.resolve<UpdaterOrderByIdCommandHandler>(
      'UpdaterOrderByIdCommandHandler'
    )
  );

  // Controllers

  container.register({
    key: 'OrderController',
    factory: () =>
      new OrderController(
        container.resolve('QueryBus'),
        container.resolve('CommandBus')
      ),
  });

  container.register({
    key: 'KitchenController',
    factory: () => new KitchenController(container.resolve('QueryBus')),
  });

  // Routes

  container.register({
    key: 'OrderRouteRegistrar',
    factory: () =>
      new OrderRouteRegistrar(container.resolve('OrderController')),
  });

  container.register({
    key: 'KitchenRouteRegistrar',
    factory: () =>
      new KitchenRouteRegistrar(container.resolve('KitchenController')),
  });
};
