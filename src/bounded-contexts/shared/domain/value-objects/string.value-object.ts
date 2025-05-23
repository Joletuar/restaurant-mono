import { DomainValidationError } from '../errors/domain-validation.error';
import { RootValueObject } from './root.value-object';

/**
 * StringValueObject is a base class for value objects that represent strings.
 */

export class StringValueObject extends RootValueObject<string> {
  static fromPrimitives(value: string): StringValueObject {
    return new StringValueObject(value);
  }

  constructor(value: string) {
    super(value.trim());
  }

  protected validate(): void {
    if (typeof this.value !== 'string') {
      throw new DomainValidationError('Invalid string', [
        `Invalid string value <${this.value}>. Expected a string.`,
      ]);
    }

    if (this.value.length === 0) {
      throw new DomainValidationError('Empty string', [
        'String value cannot be empty.',
      ]);
    }
  }
}
