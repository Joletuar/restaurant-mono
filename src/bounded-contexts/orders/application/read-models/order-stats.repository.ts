import type { OrderStatsReadModel } from './order-stats.read-model';

export interface OrderStatsRepository {
  get(): Promise<OrderStatsReadModel>;

  set(stats: OrderStatsReadModel): Promise<void>;
}
