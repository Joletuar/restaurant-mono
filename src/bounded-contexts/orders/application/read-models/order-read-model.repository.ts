import type { ReadModelRepository } from '@src/bounded-contexts/shared/application/read-model.repository';

import type { OrderReadModel } from './order.read-model';

export type OrderReadModelRepository = ReadModelRepository<OrderReadModel>;
