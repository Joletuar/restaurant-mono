import { OrderController } from '@src/apps/restaurant-api/http/rest-api/controllers/order.controller';
import { OrderRouteRegistrar } from '@src/apps/restaurant-api/http/rest-api/routes/order.route';
import { CreatorOrder } from '@src/bounded-contexts/orders/application/creator-order/creator-order.use-case';
import { FinderOrderById } from '@src/bounded-contexts/orders/application/finder-order-by-id/finder-order-by-id.use-case';
import { GetterAllOrders } from '@src/bounded-contexts/orders/application/getter-all-orders/getter-all-order.use-case';
import { UpdaterOrderById } from '@src/bounded-contexts/orders/application/updater-order-by-id/updater-order-by-id.use-case';
import { InMemoryOrderRepository } from '@src/bounded-contexts/orders/infraestructure/persistence/in-memory-order.repository';

import type { DependencyContainer } from '../dependency-container';

export const registerOrderDependencies = (
  container: DependencyContainer
): void => {
  // Repositories

  const respository = new InMemoryOrderRepository();

  container.register({
    key: 'OrderRepository',
    factory: () => respository,
  });

  // Use Cases

  const getterAllOrder = new GetterAllOrders(
    container.resolve('OrderRepository')
  );
  container.register({
    key: 'GetterAllOrders',
    factory: () => getterAllOrder,
  });

  const finderOrderById = new FinderOrderById(
    container.resolve('OrderRepository')
  );
  container.register({
    key: 'FinderOrderById',
    factory: () => finderOrderById,
  });

  const updaterOderById = new UpdaterOrderById(
    container.resolve('OrderRepository'),
    container.resolve('FinderRecipeById')
  );
  container.register({
    key: 'UpdaterOrderById',
    factory: () => updaterOderById,
  });

  const creatorOrder = new CreatorOrder(
    container.resolve('OrderRepository'),
    container.resolve('FinderRecipeById')
  );
  container.register({
    key: 'CreatorOrder',
    factory: () => creatorOrder,
  });

  // Controllers

  const controller = new OrderController(
    container.resolve('FinderOrderById'),
    container.resolve('GetterAllOrders'),
    container.resolve('CreatorOrder'),
    container.resolve('UpdaterOrderById')
  );

  container.register({
    key: 'OrderController',
    factory: () => controller,
  });

  // Routes

  const routes = new OrderRouteRegistrar(container.resolve('OrderController'));

  container.register({
    key: 'OrderRouteRegistrar',
    factory: () => routes,
  });
};
