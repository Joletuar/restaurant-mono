import type { OrderStatsReadModel } from '@src/bounded-contexts/orders/application/read-models/order-stats.read-model';
import type { OrderStatsRepository } from '@src/bounded-contexts/orders/application/read-models/order-stats.repository';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { GetterOrderStatsQuery } from './getter-order-stats.query';

export class GetterOrderStatsQueryHandler
  implements QueryHandler<GetterOrderStatsQuery, OrderStatsReadModel>
{
  constructor(private readonly repository: OrderStatsRepository) {}

  async handle(): Promise<QueryResponse<OrderStatsReadModel>> {
    const stats = await this.repository.get();

    return { data: stats };
  }
}
