import { ValidationError } from '../errors/validation.error';
import { RootValueObject } from './root.value-object';

/**
 * DateValueObject is a value object that represents a date.
 */
export class DateValueObject extends RootValueObject<Date> {
  static fromPrimitives(value: Date): DateValueObject {
    return new DateValueObject(value);
  }

  static createInRange(
    startDate: Date,
    endDate: Date,
    value: Date
  ): DateValueObject {
    if (
      value.getTime() < startDate.getTime() ||
      value.getTime() > endDate.getTime()
    ) {
      throw new ValidationError('Date out of range', [
        `Date ${value.toISOString()} is out of range ${startDate.toISOString()} - ${endDate.toISOString()}.`,
      ]);
    }

    return new DateValueObject(value);
  }

  static generateDate(): DateValueObject {
    return new DateValueObject(new Date());
  }

  protected constructor(value: Date) {
    super(value);
  }

  protected validate(): void {
    if (this.value.getTime() < 0) {
      throw new ValidationError('Date is in the past', [
        `Date value <${this.value.toISOString()}> is in the past.`,
      ]);
    }

    if (isNaN(this.value.getTime())) {
      throw new ValidationError('Date is invalid', [
        `Date value <${this.value.toISOString()}> is invalid.`,
      ]);
    }

    if (this.value.toString() === 'Invalid Date') {
      throw new ValidationError('Date is invalid', [
        `Date value <${this.value.toISOString()}> is invalid.`,
      ]);
    }
  }

  isLessThan(date: DateValueObject): boolean {
    return this.value.getTime() < date.value.getTime();
  }

  isGreaterThan(date: DateValueObject): boolean {
    return this.value.getTime() > date.value.getTime();
  }
}
