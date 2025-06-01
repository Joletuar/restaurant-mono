import { DomainValidationError } from '../errors/domain-validation.error';

export type Primitives = string | number | boolean | Date | Object;

/**
 * RootValueObject is an abstract class that represents a value object in the domain.
 * It is immutable and should be used to represent a value that has no identity.
 */

export abstract class RootValueObject<T extends Primitives> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = Object.freeze(value);

    this.ensureIsDefined();
  }

  get value(): T {
    return this._value;
  }

  equals(valueObject: RootValueObject<T>): boolean {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }

    if (this.constructor !== valueObject.constructor) {
      return false;
    }

    if (JSON.stringify(this._value) !== JSON.stringify(valueObject.value)) {
      return false;
    }

    return this._value === valueObject.value;
  }

  private ensureIsDefined(): void {
    if (this._value === null || this._value === undefined) {
      throw new DomainValidationError('Value object is not defined', [
        `The value object of type <${this.constructor.name}> cannot be null or undefined.`,
      ]);
    }
  }
}
