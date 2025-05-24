import {
  RootAggregate,
  RootAggregatePrimitives,
} from '@src/bounded-contexts/shared/domain/root.aggregate';
import { DateValueObject } from '@src/bounded-contexts/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
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
    super(id, createdAt, updatedAt);
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
