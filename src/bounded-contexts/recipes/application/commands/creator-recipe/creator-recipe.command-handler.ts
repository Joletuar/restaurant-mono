import { Recipe } from '@src/bounded-contexts/recipes/domain/recipe.entity';
import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import type { IngredientsExistenceChecker } from '@src/bounded-contexts/recipes/domain/services/ingredients-existence-checker.port';
import type { CommandHandler } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { EventBus } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { EventStore } from '@src/bounded-contexts/shared/domain/event-store.interface';

import type { CreatorRecipeCommand } from './creator-recipe.command';

export class CreatorRecipeCommandHandler
  implements CommandHandler<CreatorRecipeCommand>
{
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly recipeIngredientsExistenceChecker: IngredientsExistenceChecker,
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStore
  ) {}

  async handle(command: CreatorRecipeCommand): Promise<void> {
    await this.recipeIngredientsExistenceChecker.ensureIngredientsExist(
      command.data.ingredientsIds
    );

    const recipe = Recipe.create({
      ingredientsIds: command.data.ingredientsIds,
    });

    await this.recipeRepository.create(recipe);

    const events = recipe.pullDomainEvents();

    await this.eventStore.saveEvents(recipe.getId(), events, 0);
    await this.eventBus.publishAll(events);
  }
}
