import {
  RootEntity,
  RootEntityPrimitives,
} from '@src/modules/shared/domain/entities/root.entity';
import { DateValueObject } from '@src/modules/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/modules/shared/domain/value-objects/id.value-object';
import { StringValueObject } from '@src/modules/shared/domain/value-objects/string.value-object';

export type IngredientPrimivites = RootEntityPrimitives & {
  name: string;
};

export class Ingredient extends RootEntity<IngredientPrimivites> {
  static fromPrimitives(
    props: Omit<IngredientPrimivites, 'id' | 'createdAt' | 'updatedAt'>
  ): Ingredient {
    const { name } = props;

    return new Ingredient(
      new IdValueObject(IdValueObject.generateId()),
      new StringValueObject(name),
      new DateValueObject(new Date()),
      new DateValueObject(new Date())
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
}
