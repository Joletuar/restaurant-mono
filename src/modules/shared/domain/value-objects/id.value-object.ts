import { isValid, ulid } from 'ulidx';

import { ValidationError } from '../errors/validation.error';
import { RootValueObject } from './root.value-object';

export class IdValueObject extends RootValueObject<string> {
  static fromPrimitives(value: string): IdValueObject {
    return new IdValueObject(value);
  }

  static generateId(): string {
    return ulid();
  }

  protected constructor(value: string) {
    super(value);
  }

  protected validate(): void {
    if (!isValid(this.value)) {
      throw new ValidationError('Invalid ulid id', [
        `Id value <${this.value}> is not a valid ULID. Expected a valid ULID string.`,
      ]);
    }
  }

  toPrimitive(): string {
    return this.value;
  }
}
