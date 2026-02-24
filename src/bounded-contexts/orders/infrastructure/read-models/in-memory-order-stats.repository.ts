import type { OrderStatsReadModel } from '@src/bounded-contexts/orders/application/read-models/order-stats.read-model';
import type { OrderStatsRepository } from '@src/bounded-contexts/orders/application/read-models/order-stats.repository';

export class InMemoryOrderStatsRepository implements OrderStatsRepository {
  private stats: OrderStatsReadModel = {
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  };

  async get(): Promise<OrderStatsReadModel> {
    return { ...this.stats };
  }

  async set(stats: OrderStatsReadModel): Promise<void> {
    this.stats = { ...stats };
  }
}
