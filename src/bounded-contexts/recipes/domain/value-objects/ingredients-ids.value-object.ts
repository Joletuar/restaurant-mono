import { DomainValidationError } from '@src/bounded-contexts/shared/domain/errors/domain-validation.error';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { RootValueObject } from '@src/bounded-contexts/shared/domain/value-objects/root.value-object';

export type IngredientsIdsPrimitives = { ids: string[] };

export class IngredientsIds extends RootValueObject<IngredientsIdsPrimitives> {
  static fromPrimitives(ids: string[]): IngredientsIds {
    return new IngredientsIds(ids.map((id) => new IdValueObject(id)));
  }

  constructor(ids: IdValueObject[]) {
    super({ ids: ids.map((id) => id.value) });
  }

  protected validate(): void {
    const { ids } = this.value;

    if (!Array.isArray(ids)) {
      throw new DomainValidationError('Ids must be an array', [
        `Expected an array of strings, but got: ${ids}.`,
      ]);
    }

    if (ids.length === 0) {
      throw new DomainValidationError('Ids cannot be an empty array', [
        `Expected a non-empty array of strings, but got: ${ids}.`,
      ]);
    }
  }

  get ids(): string[] {
    return this.value.ids;
  }
}
