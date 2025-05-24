import { CreatorOrder } from '@src/bounded-contexts/orders/application/creator-order/creator-order.use-case';
import { FinderOrderById } from '@src/bounded-contexts/orders/application/finder-order-by-id/finder-order-by-id.use-case';
import { GetterAllOrders } from '@src/bounded-contexts/orders/application/getter-all-orders/getter-all-order.use-case';
import { UpdaterOrderById } from '@src/bounded-contexts/orders/application/updater-order-by-id/updater-order-by-id.use-case';
import { InMemoryOrderRepository } from '@src/bounded-contexts/orders/infraestructure/persistence/in-memory-order.repository';

import { OrderController } from '../../http/rest-api/controllers/order.controller';
import { OrderRouteRegistrar } from '../../http/rest-api/routes/order.route';
import { dependencyContainer } from '../dependency-container';

// Repositories

const respository = new InMemoryOrderRepository();

// Use Cases

const getterAllOrder = new GetterAllOrders(respository);
const finderOrderById = new FinderOrderById(respository);
const updaterOderById = new UpdaterOrderById(
  respository,
  dependencyContainer.resolve('FinderRecipeById')
);
const creatorOrder = new CreatorOrder(
  respository,
  dependencyContainer.resolve('FinderRecipeById')
);

// Controllers

const controller = new OrderController(
  finderOrderById,
  getterAllOrder,
  creatorOrder,
  updaterOderById
);

// Routes

const routes = new OrderRouteRegistrar(controller);

// Registering the use cases in the dependency container

dependencyContainer.register('GetterAllOrders', () => getterAllOrder);
dependencyContainer.register('FinderOrderById', () => finderOrderById);
dependencyContainer.register('UpdaterOrderById', () => updaterOderById);
dependencyContainer.register('CreatorOrder', () => creatorOrder);
dependencyContainer.register('OrderController', () => controller);
dependencyContainer.register('OrderRouteRegistrar', () => routes);
