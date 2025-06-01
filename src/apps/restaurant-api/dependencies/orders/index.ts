import { OrderController } from '@src/apps/restaurant-api/http/rest-api/controllers/order.controller';
import { OrderRouteRegistrar } from '@src/apps/restaurant-api/http/rest-api/routes/order.route';
import { FinderOrderByIdQuery } from '@src/bounded-contexts/orders/application/queries/finder-order-by-id/finder-order-by-id.query';
import { FinderOrderByIdQueryHandler } from '@src/bounded-contexts/orders/application/queries/finder-order-by-id/finder-order-by-id.query-handler';
import { GetterAllOrdersQuery } from '@src/bounded-contexts/orders/application/queries/getter-al-orders/getter-all-order.query';
import { GetterAllOrdersQueryHandler } from '@src/bounded-contexts/orders/application/queries/getter-al-orders/getter-all-order.query-handler';
import { CreatorOrder } from '@src/bounded-contexts/orders/application/use-cases/creator-order/creator-order.use-case';
import { FinderOrderById } from '@src/bounded-contexts/orders/application/use-cases/finder-order-by-id/finder-order-by-id.use-case';
import { GetterAllOrders } from '@src/bounded-contexts/orders/application/use-cases/getter-all-orders/getter-all-order.use-case';
import { UpdaterOrderById } from '@src/bounded-contexts/orders/application/use-cases/updater-order-by-id/updater-order-by-id.use-case';
import { InMemoryOrderRepository } from '@src/bounded-contexts/orders/infraestructure/persistence/in-memory-order.repository';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/query-bus.interface';

import type { DependencyContainer } from '../dependency-container';

export const registerOrderDependencies = (
  container: DependencyContainer
): void => {
  // Repositories

  container.register({
    key: 'OrderRepository',
    factory: () => new InMemoryOrderRepository(),
  });

  // Use Cases

  container.register({
    key: 'GetterAllOrders',
    factory: () => new GetterAllOrders(container.resolve('OrderRepository')),
  });

  container.register({
    key: 'FinderOrderById',
    factory: () => new FinderOrderById(container.resolve('OrderRepository')),
  });

  container.register({
    key: 'UpdaterOrderById',
    factory: () =>
      new UpdaterOrderById(
        container.resolve('OrderRepository'),
        container.resolve('FinderRecipeById')
      ),
  });

  container.register({
    key: 'CreatorOrder',
    factory: () =>
      new CreatorOrder(
        container.resolve('OrderRepository'),
        container.resolve('FinderRecipeById')
      ),
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
