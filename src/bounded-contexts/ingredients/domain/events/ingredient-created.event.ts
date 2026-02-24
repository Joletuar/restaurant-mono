import { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';

import type { Ingredient, IngredientPrimivites } from '../ingredient.entity';

export class IngredientCreatedEvent extends DomainEvent<IngredientPrimivites> {
  static readonly EVENT_NAME = 'ingredient.created';
  static readonly EVENT_VERSION = 1;

  static fromPrimitives(ingredient: Ingredient): IngredientCreatedEvent {
    return new IngredientCreatedEvent(ingredient);
  }

  constructor(ingredient: Ingredient) {
    super(
      IngredientCreatedEvent.EVENT_NAME,
      ingredient.getId(),
      IngredientCreatedEvent.EVENT_VERSION,
      ingredient.toPrimitives()
    );
  }
}
