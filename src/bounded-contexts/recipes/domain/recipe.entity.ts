import {
  RootEntity,
  RootEntityPrimitives,
} from '@src/modules/shared/domain/entities/root.entity';
import { DateValueObject } from '@src/modules/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/modules/shared/domain/value-objects/id.value-object';

import { IngredientsIds } from './value-objects/ingredients-ids.value-object';

export type RecipePrimitives = RootEntityPrimitives & {
  ingredientsIds: string[];
};

export class Recipe extends RootEntity<RecipePrimitives> {
  static fromPrimitives(
    props: Omit<RecipePrimitives, 'id' | 'createdAt' | 'updatedAt'>
  ): Recipe {
    const { ingredientsIds } = props;

    return new Recipe(
      new IdValueObject(IdValueObject.generateId()),
      IngredientsIds.fromPrimitives(ingredientsIds),
      new DateValueObject(new Date()),
      new DateValueObject(new Date())
    );
  }

  constructor(
    id: IdValueObject,
    private ingredientsIds: IngredientsIds,
    createdAt: DateValueObject,
    updatedAt: DateValueObject
  ) {
    super(id, createdAt, updatedAt);
  }

  toPrimitives(): RecipePrimitives {
    return {
      id: this.id.value,
      ingredientsIds: this.ingredientsIds.ids,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}
