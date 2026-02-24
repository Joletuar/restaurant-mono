import {
  RootAggregate,
  type RootAggregatePrimitives,
} from '@src/bounded-contexts/shared/domain/root.aggregate';
import { DateValueObject } from '@src/bounded-contexts/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { NumberValueObject } from '@src/bounded-contexts/shared/domain/value-objects/number.value-object';
import { StringValueObject } from '@src/bounded-contexts/shared/domain/value-objects/string.value-object';

import { IngredientCreatedEvent } from './events/ingredient-created.event';

export type IngredientPrimivites = RootAggregatePrimitives & {
  name: string;
};

export class Ingredient extends RootAggregate<IngredientPrimivites> {
  static create(
    props: Omit<IngredientPrimivites, 'id' | 'createdAt' | 'updatedAt'>
  ): Ingredient {
    const { name } = props;

    const ingredient = new Ingredient(
      IdValueObject.generateId(),
      new StringValueObject(name),
      DateValueObject.now(),
      DateValueObject.now()
    );

    return this.recordCreation(
      ingredient,
      IngredientCreatedEvent.fromPrimitives(ingredient)
    );
  }

  static rehydrate(props: IngredientPrimivites): Ingredient {
    const { id, name, createdAt, updatedAt } = props;

    return new Ingredient(
      IdValueObject.fromPrimitives(id),
      new StringValueObject(name),
      DateValueObject.fromPrimitives(createdAt),
      DateValueObject.fromPrimitives(updatedAt)
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
