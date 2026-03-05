import {
  RootAggregate,
  type RootAggregatePrimitives,
} from '@src/bounded-contexts/shared/domain/root.aggregate';
import { DateValueObject } from '@src/bounded-contexts/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { NumberValueObject } from '@src/bounded-contexts/shared/domain/value-objects/number.value-object';

import { InvalidOrderStatusTransitionError } from './errors/invalid-order-status-transition.error';
import { OrderCancelledEvent } from './events/order-cancelled.event';
import { OrderCompletedEvent } from './events/order-completed.event';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderMovedToInProgressEvent } from './events/order-moved-to-in-progress.event';
import { OrderStatusUpdatedEvent } from './events/order-status-updated.event';
import {
  OrderStatus,
  OrderStatusEnum,
} from './value-objects/order-status.value-object';

export type OrderPrimitives = RootAggregatePrimitives & {
  recipeId: string;
  status: string;
};

export class Order extends RootAggregate<OrderPrimitives> {
  static create(
    props: Omit<OrderPrimitives, 'id' | 'createdAt' | 'updatedAt'>
  ): Order {
    const { recipeId, status } = props;

    const order = new Order(
      IdValueObject.generateId(),
      new IdValueObject(recipeId),
      OrderStatus.fromPrimitives(status),
      DateValueObject.now(),
      DateValueObject.now()
    );

    return this.recordCreation(order, OrderCreatedEvent.fromPrimitives(order));
  }

  static rehydrate(props: OrderPrimitives): Order {
    const { id, recipeId, status, createdAt, updatedAt } = props;

    return new Order(
      IdValueObject.fromPrimitives(id),
      IdValueObject.fromPrimitives(recipeId),
      OrderStatus.fromPrimitives(status),
      DateValueObject.fromPrimitives(createdAt),
      DateValueObject.fromPrimitives(updatedAt)
    );
  }

  constructor(
    id: IdValueObject,
    private recipeId: IdValueObject,
    private status: OrderStatus,
    createdAt: DateValueObject,
    updatedAt: DateValueObject
  ) {
    // TODO: version is hardcoded to 1. Implement optimistic concurrency control
    // by persisting and incrementing version on each aggregate mutation.
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
    const previousStatus = this.status.value;

    if (this.status.isCancelled() || this.status.isCompleted()) {
      throw new InvalidOrderStatusTransitionError(
        'Cannot update status for an order that is already cancelled or completed',
        previousStatus,
        newStatus.value
      );
    }

    if (this.status.isPending()) {
      if (newStatus.isCancelled() || newStatus.isCompleted()) {
        throw new InvalidOrderStatusTransitionError(
          'Cannot transition directly from pending status to cancelled or completed',
          previousStatus,
          newStatus.value
        );
      }
    }

    this.record(
      new OrderStatusUpdatedEvent({
        orderId: this.id.value,
        previousStatus,
        newStatus: newStatus.value,
      })
    );

    if (newStatus.value === OrderStatusEnum.IN_PROGRESS) {
      this.record(
        new OrderMovedToInProgressEvent({
          orderId: this.id.value,
          previousStatus,
          newStatus: newStatus.value,
        })
      );
    }

    if (newStatus.value === OrderStatusEnum.COMPLETED) {
      this.record(
        new OrderCompletedEvent({
          orderId: this.id.value,
          previousStatus,
          newStatus: newStatus.value,
        })
      );
    }

    if (newStatus.value === OrderStatusEnum.CANCELLED) {
      this.record(
        new OrderCancelledEvent({
          orderId: this.id.value,
          previousStatus,
          newStatus: newStatus.value,
        })
      );
    }

    this.status = newStatus;
  }

  getRecipeIdValue(): string {
    return this.recipeId.value;
  }
}
