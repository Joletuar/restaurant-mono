import type { KitchenOrderReadModelRepository } from '@src/bounded-contexts/orders/application/read-models/kitchen-order-read-model.repository';
import type { KitchenOrderReadModel } from '@src/bounded-contexts/orders/application/read-models/kitchen-order.read-model';
import type {
  QueryHandler,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { GetterKitchenQueueQuery } from './getter-kitchen-queue.query';

export class GetterKitchenQueueQueryHandler
  implements QueryHandler<GetterKitchenQueueQuery, KitchenOrderReadModel[]>
{
  constructor(private readonly repository: KitchenOrderReadModelRepository) {}

  async handle(): Promise<QueryResponse<KitchenOrderReadModel[]>> {
    const items = await this.repository.getAll();

    return { data: items };
  }
}
