import { DomainValidationError } from '@src/bounded-contexts/shared/domain/errors/domain-validation.error';
import { StringValueObject } from '@src/bounded-contexts/shared/domain/value-objects/string.value-object';

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
    this.isValid(value);

    return new OrderStatus(value);
  }

  private static isValid(value: string): void {
    const isValid = Object.values(OrderStatusEnum).includes(
      value as OrderStatusEnum
    );

    if (!isValid) {
      throw new DomainValidationError('Invalid order status value', [
        `The value <${value}> is not a valid order status.`,
        `Valid values are: ${Object.values(OrderStatusEnum).join(', ')}.`,
      ]);
    }
  }

  static Pending(): OrderStatus {
    return new OrderStatus(OrderStatusEnum.PENDING);
  }

  static InProgress(): OrderStatus {
    return new OrderStatus(OrderStatusEnum.IN_PROGRESS);
  }

  static Completed(): OrderStatus {
    return new OrderStatus(OrderStatusEnum.COMPLETED);
  }

  static Cancelled(): OrderStatus {
    return new OrderStatus(OrderStatusEnum.CANCELLED);
  }

  protected constructor(value: string) {
    super(value);
  }

  isPending(): boolean {
    return this._value === OrderStatusEnum.PENDING.valueOf();
  }

  isInProgress(): boolean {
    return this._value === OrderStatusEnum.IN_PROGRESS.valueOf();
  }

  isCompleted(): boolean {
    return this._value === OrderStatusEnum.COMPLETED.valueOf();
  }

  isCancelled(): boolean {
    return this._value === OrderStatusEnum.CANCELLED.valueOf();
  }
}
