import { ValidationError } from '@src/modules/shared/domain/errors/validation.error';
import { StringValueObject } from '@src/modules/shared/domain/value-objects/string.value-object';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class OrderStatus extends StringValueObject {
  static fromPrimitives(value: OrderStatusEnum): OrderStatus;

  static fromPrimitives(value: string): OrderStatus;

  static fromPrimitives(value: OrderStatusEnum | string): OrderStatus {
    if (!this.isValid(value)) {
      throw new ValidationError('Invalid order status value', [
        `The value <${value}> is not a valid order status.`,
        `Valid values are: ${Object.values(OrderStatusEnum).join(', ')}.`,
      ]);
    }

    return new OrderStatus(value);
  }

  static isValid(value: string): boolean {
    return Object.values(OrderStatusEnum).includes(value as OrderStatusEnum);
  }

  static createPending(): OrderStatus {
    return new OrderStatus(OrderStatusEnum.PENDING);
  }

  static createInProgress(): OrderStatus {
    return new OrderStatus(OrderStatusEnum.IN_PROGRESS);
  }

  static createCompleted(): OrderStatus {
    return new OrderStatus(OrderStatusEnum.COMPLETED);
  }

  static createCancelled(): OrderStatus {
    return new OrderStatus(OrderStatusEnum.CANCELLED);
  }

  protected constructor(value: string) {
    super(value);
  }
}
