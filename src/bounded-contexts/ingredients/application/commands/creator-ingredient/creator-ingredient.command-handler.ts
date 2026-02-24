import { Ingredient } from '@src/bounded-contexts/ingredients/domain/ingredient.entity';
import type { IngredientRepository } from '@src/bounded-contexts/ingredients/domain/ingredient.repository';
import type { CommandHandler } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { EventBus } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { EventStore } from '@src/bounded-contexts/shared/domain/event-store.interface';

import type { CreatorIngredientCommand } from './creator-ingredient.command';

export class CreatorIngredientCommandHandler
  implements CommandHandler<CreatorIngredientCommand>
{
  constructor(
    private readonly repository: IngredientRepository,
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStore
  ) {}

  async handle(command: CreatorIngredientCommand): Promise<void> {
    const ingredient = Ingredient.create({
      name: command.data.name,
    });

    await this.repository.create(ingredient);

    const events = ingredient.pullDomainEvents();

    await this.eventStore.saveEvents(ingredient.getId(), events, 0);
    await this.eventBus.publishAll(events);
  }
}
