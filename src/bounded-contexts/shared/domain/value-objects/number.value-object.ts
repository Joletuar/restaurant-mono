import { DomainValidationError } from '../errors/domain-validation.error';
import { RootValueObject } from './root.value-object';

/**
 * NumberValueObject class is a value object that represents a number.
 */

export class NumberValueObject extends RootValueObject<number> {
  static fromPrimitives(value: number): NumberValueObject {
    this.validate(value);

    return new NumberValueObject(value);
  }

  static createWithRange(
    value: number,
    min: number,
    max: number
  ): NumberValueObject {
    this.validate(value);

    if (value < min || value > max) {
      throw new DomainValidationError('Number out of range', [
        `Number value <${value}> is out of range. Expected between ${min} and ${max}.`,
      ]);
    }

    return new NumberValueObject(value);
  }

  private static validate(value: number): void {
    if (typeof value !== 'number') {
      throw new DomainValidationError('Invalid number', [
        `Number value <${value}> is not a valid number.`,
      ]);
    }
  }

  constructor(value: number) {
    super(value);
  }

  isPositive(): boolean {
    return this.value > 0;
  }
}
