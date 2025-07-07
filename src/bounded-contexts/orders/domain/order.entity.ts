import {
  RootAggregate,
  type RootAggregatePrimitives,
} from '@src/bounded-contexts/shared/domain/root.aggregate';
import { DateValueObject } from '@src/bounded-contexts/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { NumberValueObject } from '@src/bounded-contexts/shared/domain/value-objects/number.value-object';

import { InvalidOrderStatusTransitionError } from './errors/invalid-order-status-transition.error';
import { OrderStatusUpdatedEvent } from './events/order-status-updated.event';
import { OrderStatus } from './value-objects/order-status.value-object';

export type OrderPrimitives = RootAggregatePrimitives & {
  recipeId: string;
  status: string;
};

export class Order extends RootAggregate<OrderPrimitives> {
  static fromPrimitives(
    props: Omit<OrderPrimitives, 'id' | 'createdAt' | 'updatedAt'>
  ): Order {
    const { recipeId, status } = props;

    return new Order(
      IdValueObject.generateId(),
      new IdValueObject(recipeId),
      OrderStatus.fromPrimitives(status),
      DateValueObject.now(),
      DateValueObject.now()
    );
  }

  constructor(
    id: IdValueObject,
    private recipeId: IdValueObject,
    private status: OrderStatus,
    createdAt: DateValueObject,
    updatedAt: DateValueObject
  ) {
    super(id, new NumberValueObject(1), createdAt, updatedAt);
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

  updateStatus(newStatus: OrderStatus): void {
    if (this.status.isCancelled() || this.status.isCompleted()) {
      throw new InvalidOrderStatusTransitionError(
        'Cannot update status for an order that is already cancelled or completed',
        this.status.value,
        newStatus.value
      );
    }

    if (this.status.isPending()) {
      if (newStatus.isCancelled() || newStatus.isCompleted()) {
        throw new InvalidOrderStatusTransitionError(
          'Cannot transition directly from pending status to cancelled or completed',
          this.status.value,
          newStatus.value
        );
      }
    }

    this.record(
      new OrderStatusUpdatedEvent({
        orderId: this.id.value,
        previousStatus: this.status.value,
        newStatus: newStatus.value,
      })
    );

    this.status = newStatus;
  }

  getRecipeIdValue(): string {
    return this.recipeId.value;
  }
}
