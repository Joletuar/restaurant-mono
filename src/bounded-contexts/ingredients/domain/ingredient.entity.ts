import {
  RootAggregate,
  type RootAggregatePrimitives,
} from '@src/bounded-contexts/shared/domain/root.aggregate';
import { DateValueObject } from '@src/bounded-contexts/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { NumberValueObject } from '@src/bounded-contexts/shared/domain/value-objects/number.value-object';
import { StringValueObject } from '@src/bounded-contexts/shared/domain/value-objects/string.value-object';

export type IngredientPrimivites = RootAggregatePrimitives & {
  name: string;
};

export class Ingredient extends RootAggregate<IngredientPrimivites> {
  static fromPrimitives(
    props: Omit<IngredientPrimivites, 'id' | 'createdAt' | 'updatedAt'>
  ): Ingredient {
    const { name } = props;

    return new Ingredient(
      IdValueObject.generateId(),
      new StringValueObject(name),
      DateValueObject.now(),
      DateValueObject.now()
    );
  }

  constructor(
    id: IdValueObject,
    private readonly name: StringValueObject,
    createdAt: DateValueObject,
    updatedAt: DateValueObject
  ) {
    super(id, new NumberValueObject(1), createdAt, updatedAt);
  }

  toPrimitives(): IngredientPrimivites {
    return {
      id: this.id.value,
      name: this.name.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  getId(): string {
    return this.id.value;
  }
}
