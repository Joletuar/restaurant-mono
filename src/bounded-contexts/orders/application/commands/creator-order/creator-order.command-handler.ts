import { OrderCreatedEvent } from '@src/bounded-contexts/orders/domain/events/order-created.event';
import { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import type { RecipeRepository } from '@src/bounded-contexts/recipes/domain/recipe.repository';
import type { CommandHandler } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { EventBus } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import type { CreatorOrderCommand } from './creator-order.command';

export class CreatorOrderCommandHandler
  implements CommandHandler<CreatorOrderCommand>
{
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly recipeRepository: RecipeRepository,
    private readonly eventBus: EventBus
  ) {}

  async handle(command: CreatorOrderCommand): Promise<void> {
    await this.ensureIsValidRecipe(command.data.recipeId);

    const order = Order.fromPrimitives({
      recipeId: command.data.recipeId,
      status: command.data.status,
    });

    await this.orderRepository.create(order);

    await this.publisEvents(order);
  }

  private async ensureIsValidRecipe(recipeId: string): Promise<void> {
    const recipe = await this.recipeRepository.findById(
      IdValueObject.fromPrimitives(recipeId)
    );

    if (!recipe) {
      throw new NotFoundError(`Recipe with id <${recipeId}> not found.`, [
        `Recipe with id <${recipeId}> not found.`,
      ]);
    }
  }

  private async publisEvents(order: Order): Promise<void> {
    const event = OrderCreatedEvent.fromPrimitives(order);

    await this.eventBus.publish(event);
  }
}
