import { DomainValidationError } from '@src/bounded-contexts/shared/domain/errors/domain-validation.error';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { RootValueObject } from '@src/bounded-contexts/shared/domain/value-objects/root.value-object';

export type IngredientsIdsPrimitives = { ids: string[] };

export class IngredientsIds extends RootValueObject<IngredientsIdsPrimitives> {
  static fromPrimitives(ids: string[]): IngredientsIds {
    this.validate(ids);

    return new IngredientsIds(ids.map((id) => new IdValueObject(id)));
  }

  private static validate(value: string[]): void {
    if (!Array.isArray(value)) {
      throw new DomainValidationError('Ids must be an array', [
        `Expected an array of strings, but got: ${value}.`,
      ]);
    }

    if (value.length === 0) {
      throw new DomainValidationError('Ids cannot be an empty array', [
        `Expected a non-empty array of strings, but got: ${value}.`,
      ]);
    }
  }

  constructor(ids: IdValueObject[]) {
    super({ ids: ids.map((id) => id.value) });
  }

  getIds(): string[] {
    return this.value.ids;
  }
}
