import { DomainValidationError } from '../errors/domain-validation.error';
import { RootValueObject } from './root.value-object';

/**
 * StringValueObject is a base class for value objects that represent strings.
 */

export class StringValueObject extends RootValueObject<string> {
  static fromPrimitives(value: string): StringValueObject {
    this.validate(value);

    return new StringValueObject(value);
  }

  private static validate(value: string): void {
    if (typeof value !== 'string') {
      throw new DomainValidationError('Invalid string', [
        `Invalid string value <${value}>. Expected a string.`,
      ]);
    }

    if (value.length === 0) {
      throw new DomainValidationError('Empty string', [
        'String value cannot be empty.',
      ]);
    }
  }

  constructor(value: string) {
    super(value.trim());
  }
}
