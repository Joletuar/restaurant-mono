import type { RecipeReadModelRepository } from '@src/bounded-contexts/recipes/application/read-models/recipe-read-model.repository';
import { RecipeCreatedEvent } from '@src/bounded-contexts/recipes/domain/events/recipe-created.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class RecipeCreatedReadModelProjector
  implements EventHandler<RecipeCreatedEvent>
{
  constructor(private readonly repository: RecipeReadModelRepository) {}

  async handle(event: RecipeCreatedEvent): Promise<void> {
    await this.repository.save({
      id: event.payload.id,
      ingredientsIds: event.payload.ingredientsIds,
      createdAt: event.payload.createdAt,
      updatedAt: event.payload.updatedAt,
    });
  }

  getEventType(): string {
    return RecipeCreatedEvent.EVENT_NAME;
  }
}
