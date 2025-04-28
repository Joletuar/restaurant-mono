import { ValidationError } from '../errors/validation.error';
import { RootValueObject } from './root.value-object';

/**
 * NumberValueObject class is a value object that represents a number.
 */

export class NumberValueObject extends RootValueObject<number> {
  static fromPrimitives(value: number): NumberValueObject {
    return new NumberValueObject(value);
  }

  static createWithRange(
    value: number,
    min: number,
    max: number
  ): NumberValueObject {
    if (value < min || value > max) {
      throw new ValidationError('Number out of range', [
        `Number value <${value}> is out of range. Expected between ${min} and ${max}.`,
      ]);
    }

    return new NumberValueObject(value);
  }

  protected constructor(value: number) {
    super(value);
  }

  protected validate(): void {
    if (typeof this.value !== 'number') {
      throw new ValidationError('Invalid number', [
        `Number value <${this.value}> is not a valid number.`,
      ]);
    }
  }

  toPrimitive(): number {
    return this.value;
  }

  isPositive(): boolean {
    return this.value > 0;
  }
}
