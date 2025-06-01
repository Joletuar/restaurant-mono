import { isValid, ulid } from 'ulidx';

import { DomainValidationError } from '../errors/domain-validation.error';
import { RootValueObject } from './root.value-object';

export class IdValueObject extends RootValueObject<string> {
  static fromPrimitives(value: string): IdValueObject {
    this.validate(value);

    return new IdValueObject(value);
  }

  private static validate(value: string): void {
    if (!isValid(value)) {
      throw new DomainValidationError('Invalid ulid id', [
        `Id value <${value}> is not a valid ULID. Expected a valid ULID string.`,
      ]);
    }
  }

  static generateId(): IdValueObject {
    return new IdValueObject(ulid());
  }

  constructor(value: string) {
    super(value);
  }
}
