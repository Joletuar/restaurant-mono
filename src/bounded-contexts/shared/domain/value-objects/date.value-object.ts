import { DomainValidationError } from '../errors/domain-validation.error';
import { RootValueObject } from './root.value-object';

/**
 * DateValueObject is a value object that represents a date.
 */
export class DateValueObject extends RootValueObject<Date> {
  static fromPrimitives(value: Date): DateValueObject {
    this.validate(value);

    return new DateValueObject(value);
  }

  private static validate(value: Date): void {
    if (value.getTime() < 0) {
      throw new DomainValidationError('Date is in the past', [
        `Date value <${value.toISOString()}> is in the past.`,
      ]);
    }

    if (isNaN(value.getTime())) {
      throw new DomainValidationError('Date is invalid', [
        `Date value <${value.toISOString()}> is invalid.`,
      ]);
    }

    if (value.toString() === 'Invalid Date') {
      throw new DomainValidationError('Date is invalid', [
        `Date value <${value.toISOString()}> is invalid.`,
      ]);
    }
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
      throw new DomainValidationError('Date out of range', [
        `Date ${value.toISOString()} is out of range ${startDate.toISOString()} - ${endDate.toISOString()}.`,
      ]);
    }

    return new DateValueObject(value);
  }

  static now(): DateValueObject {
    return new DateValueObject(new Date());
  }

  constructor(value: Date) {
    super(value);
  }

  isLessThan(date: DateValueObject): boolean {
    return this.value.getTime() < date.value.getTime();
  }

  isGreaterThan(date: DateValueObject): boolean {
    return this.value.getTime() > date.value.getTime();
  }
}
