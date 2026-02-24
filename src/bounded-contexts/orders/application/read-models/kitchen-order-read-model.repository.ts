import type { ReadModelRepository } from '@src/bounded-contexts/shared/application/read-model.repository';

import type { KitchenOrderReadModel } from './kitchen-order.read-model';

export type KitchenOrderReadModelRepository =
  ReadModelRepository<KitchenOrderReadModel>;
