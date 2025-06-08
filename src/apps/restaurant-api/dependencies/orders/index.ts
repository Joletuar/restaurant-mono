import { OrderController } from '@src/apps/restaurant-api/http/rest-api/controllers/order.controller';
import { OrderRouteRegistrar } from '@src/apps/restaurant-api/http/rest-api/routes/order.route';
import { CreatorOrderCommand } from '@src/bounded-contexts/orders/application/commands/creator-order/creator-order.command';
import { CreatorOrderCommandHandler } from '@src/bounded-contexts/orders/application/commands/creator-order/creator-order.command-handler';
import { UpdaterOrderByIdCommand } from '@src/bounded-contexts/orders/application/commands/updater-order-by-id/updater-order-by-id.command';
import { UpdaterOrderByIdCommandHandler } from '@src/bounded-contexts/orders/application/commands/updater-order-by-id/updater-order-by-id.command-handler';
import { OrderCreatedEventHandler } from '@src/bounded-contexts/orders/application/event-handlers/order-created/order-created.event-handler';
import { FinderOrderByIdQuery } from '@src/bounded-contexts/orders/application/queries/finder-order-by-id/finder-order-by-id.query';
import { FinderOrderByIdQueryHandler } from '@src/bounded-contexts/orders/application/queries/finder-order-by-id/finder-order-by-id.query-handler';
import { GetterAllOrdersQuery } from '@src/bounded-contexts/orders/application/queries/getter-all-orders/getter-all-orders.query';
import { GetterAllOrdersQueryHandler } from '@src/bounded-contexts/orders/application/queries/getter-all-orders/getter-all-orders.query-handler';
import { InMemoryOrderRepository } from '@src/bounded-contexts/orders/infraestructure/persistence/in-memory-order.repository';
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

  //  Query Handlers

  container.register({
    key: 'GetterAllOrdersQueryHandler',
    factory: () =>
      new GetterAllOrdersQueryHandler(container.resolve('OrderRepository')),
  });

  container.register({
    key: 'FinderOrderByIdQueryHandler',
    factory: () =>
      new FinderOrderByIdQueryHandler(container.resolve('OrderRepository')),
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

  // Event Handlers

  container.register({
    key: 'OrderCreatedEventHandler',
    factory: () => new OrderCreatedEventHandler(),
  });

  const eventBus = container.resolve<EventBus>('EventBus');

  eventBus.subscribe(
    container.resolve<OrderCreatedEventHandler>('OrderCreatedEventHandler')
  );

  // Command Handlers

  container.register({
    key: 'CreatorOrderCommandHandler',
    factory: () =>
      new CreatorOrderCommandHandler(
        container.resolve('OrderRepository'),
        queryBus,
        eventBus
      ),
  });

  container.register({
    key: 'UpdaterOrderByIdCommandHandler',
    factory: () =>
      new UpdaterOrderByIdCommandHandler(container.resolve('OrderRepository')),
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

  // Routes

  container.register({
    key: 'OrderRouteRegistrar',
    factory: () =>
      new OrderRouteRegistrar(container.resolve('OrderController')),
  });
};
