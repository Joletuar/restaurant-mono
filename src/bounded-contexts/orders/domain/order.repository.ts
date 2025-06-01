import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import type { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import type { Order } from './order.entity';

export interface OrderRepository {
  findById(id: IdValueObject): Promise<Nullable<Order>>;

  getAll(): Promise<Order[]>;

  update(order: Order): Promise<void>;

  create(order: Order): Promise<void>;
}
