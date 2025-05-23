import {
  RootEntity,
  RootEntityPrimitives,
} from '@src/modules/shared/domain/entities/root.entity';
import { DateValueObject } from '@src/modules/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/modules/shared/domain/value-objects/id.value-object';

import { OrderStatus } from './value-objects/order-status.value-object';

export type OrderPrimitives = RootEntityPrimitives & {
  recipeId: string;
  status: string;
};

export class Order extends RootEntity<OrderPrimitives> {
  static fromPrimitives(
    props: Omit<OrderPrimitives, 'id' | 'createdAt' | 'updatedAt'>
  ): Order {
    const { recipeId, status } = props;

    return new Order(
      new IdValueObject(IdValueObject.generateId()),
      new IdValueObject(recipeId),
      OrderStatus.fromPrimitives(status),
      new DateValueObject(new Date()),
      new DateValueObject(new Date())
    );
  }

  constructor(
    id: IdValueObject,
    private recipeId: IdValueObject,
    private status: OrderStatus,
    createdAt: DateValueObject,
    updatedAt: DateValueObject
  ) {
    super(id, createdAt, updatedAt);
  }

  toPrimitives(): OrderPrimitives {
    return {
      id: this.id.value,
      recipeId: this.recipeId.value,
      status: this.status.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
  }
}
