import { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';

import type { Recipe, RecipePrimitives } from '../recipe.entity';

export class RecipeCreatedEvent extends DomainEvent<RecipePrimitives> {
  static readonly EVENT_NAME = 'recipe.created';
  static readonly EVENT_VERSION = 1;

  static fromPrimitives(recipe: Recipe): RecipeCreatedEvent {
    return new RecipeCreatedEvent(recipe);
  }

  constructor(recipe: Recipe) {
    super(
      RecipeCreatedEvent.EVENT_NAME,
      recipe.getId(),
      RecipeCreatedEvent.EVENT_VERSION,
      recipe.toPrimitives()
    );
  }
}
