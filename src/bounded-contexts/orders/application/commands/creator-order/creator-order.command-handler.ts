import { OrderCreatedEvent } from '@src/bounded-contexts/orders/domain/events/order-created.event';
import { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { FinderRecipeByIdQuery } from '@src/bounded-contexts/recipes/application/queries/finder-recipe-by-id/finder-recipe-by-id.query';
import type { CommandHandler } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { EventBus } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { CreatorOrderCommand } from './creator-order.command';

export class CreatorOrderCommandHandler
  implements CommandHandler<CreatorOrderCommand>
{
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus
  ) {}

  async handle(command: CreatorOrderCommand): Promise<void> {
    await this.ensureIsValidRecipe(command.data.recipeId);

    const order = Order.fromPrimitives({
      recipeId: command.data.recipeId,
      status: command.data.status,
    });

    await this.orderRepository.create(order);

    await this.publisEvent(order);
  }

  private async ensureIsValidRecipe(recipeId: string): Promise<void> {
    await this.queryBus.dispatch(new FinderRecipeByIdQuery(recipeId));
  }

  private async publisEvent(order: Order): Promise<void> {
    await this.eventBus.publish(OrderCreatedEvent.fromPrimitives(order));
  }
}
