import { OrderController } from '@src/apps/restaurant-api/http/rest-api/controllers/order.controller';
import { OrderRouteRegistrar } from '@src/apps/restaurant-api/http/rest-api/routes/order.route';
import { CreatorOrder } from '@src/bounded-contexts/orders/application/creator-order/creator-order.use-case';
import { FinderOrderById } from '@src/bounded-contexts/orders/application/finder-order-by-id/finder-order-by-id.use-case';
import { GetterAllOrders } from '@src/bounded-contexts/orders/application/getter-all-orders/getter-all-order.use-case';
import { UpdaterOrderById } from '@src/bounded-contexts/orders/application/updater-order-by-id/updater-order-by-id.use-case';
import { InMemoryOrderRepository } from '@src/bounded-contexts/orders/infraestructure/persistence/in-memory-order.repository';

import { dependencyContainer } from '../dependency-container';

// Repositories

const respository = new InMemoryOrderRepository();

dependencyContainer.register('OrderRepository', () => respository);

// Use Cases

const getterAllOrder = new GetterAllOrders(
  dependencyContainer.resolve('OrderRepository')
);
dependencyContainer.register('GetterAllOrders', () => getterAllOrder);

const finderOrderById = new FinderOrderById(
  dependencyContainer.resolve('OrderRepository')
);
dependencyContainer.register('FinderOrderById', () => finderOrderById);

const updaterOderById = new UpdaterOrderById(
  dependencyContainer.resolve('OrderRepository'),
  dependencyContainer.resolve('FinderRecipeById')
);
dependencyContainer.register('UpdaterOrderById', () => updaterOderById);

const creatorOrder = new CreatorOrder(
  dependencyContainer.resolve('OrderRepository'),
  dependencyContainer.resolve('FinderRecipeById')
);
dependencyContainer.register('CreatorOrder', () => creatorOrder);

// Controllers

const controller = new OrderController(
  dependencyContainer.resolve('FinderOrderById'),
  dependencyContainer.resolve('GetterAllOrders'),
  dependencyContainer.resolve('CreatorOrder'),
  dependencyContainer.resolve('UpdaterOrderById')
);

dependencyContainer.register('OrderController', () => controller);

// Routes

const routes = new OrderRouteRegistrar(
  dependencyContainer.resolve('OrderController')
);

dependencyContainer.register('OrderRouteRegistrar', () => routes);
