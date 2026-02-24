import type { IngredientReadModelRepository } from '@src/bounded-contexts/ingredients/application/read-models/ingredient-read-model.repository';
import { IngredientCreatedEvent } from '@src/bounded-contexts/ingredients/domain/events/ingredient-created.event';
import type { EventHandler } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';

export class IngredientCreatedReadModelProjector
  implements EventHandler<IngredientCreatedEvent>
{
  constructor(private readonly repository: IngredientReadModelRepository) {}

  async handle(event: IngredientCreatedEvent): Promise<void> {
    await this.repository.save({
      id: event.payload.id,
      name: event.payload.name,
      createdAt: event.payload.createdAt,
      updatedAt: event.payload.updatedAt,
    });
  }

  getEventType(): string {
    return IngredientCreatedEvent.EVENT_NAME;
  }
}
