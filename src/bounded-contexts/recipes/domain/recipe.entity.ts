import {
  RootAggregate,
  type RootAggregatePrimitives,
} from '@src/bounded-contexts/shared/domain/root.aggregate';
import { DateValueObject } from '@src/bounded-contexts/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { NumberValueObject } from '@src/bounded-contexts/shared/domain/value-objects/number.value-object';

import { IngredientsIds } from './value-objects/ingredients-ids.value-object';

export type RecipePrimitives = RootAggregatePrimitives & {
  ingredientsIds: string[];
};

export class Recipe extends RootAggregate<RecipePrimitives> {
  static fromPrimitives(
    props: Omit<RecipePrimitives, 'id' | 'createdAt' | 'updatedAt'>
  ): Recipe {
    const { ingredientsIds } = props;

    return new Recipe(
      IdValueObject.generateId(),
      IngredientsIds.fromPrimitives(ingredientsIds),
      DateValueObject.now(),
      DateValueObject.now()
    );
  }

  constructor(
    id: IdValueObject,
    private ingredientsIds: IngredientsIds,
    createdAt: DateValueObject,
    updatedAt: DateValueObject
  ) {
    super(id, new NumberValueObject(1), createdAt, updatedAt);
  }

  toPrimitives(): RecipePrimitives {
    return {
      id: this.id.value,
      ingredientsIds: this.ingredientsIds.getIds(),
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  getId(): string {
    return this.id.value;
  }
}
