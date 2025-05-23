import { Nullable } from '@src/modules/shared/domain/nullable.type';
import { IdValueObject } from '@src/modules/shared/domain/value-objects/id.value-object';

import { Order } from './order.entity';

export interface OrderRepository {
  findById(id: IdValueObject): Promise<Nullable<Order>>;

  getAll(): Promise<Order[]>;

  update(order: Order): Promise<void>;

  create(order: Order): Promise<void>;
}
