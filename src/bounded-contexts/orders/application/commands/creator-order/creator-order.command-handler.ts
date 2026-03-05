import { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import type { RecipeExistenceChecker } from '@src/bounded-contexts/orders/domain/services/recipe-existence-checker.port';
import type { CommandHandler } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { EventBus } from '@src/bounded-contexts/shared/domain/bus/event-bus.interface';
import type { EventStore } from '@src/bounded-contexts/shared/domain/event-store.interface';

import type { CreatorOrderCommand } from './creator-order.command';

export class CreatorOrderCommandHandler
  implements CommandHandler<CreatorOrderCommand>
{
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderRecipeExistenceChecker: RecipeExistenceChecker,
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStore
  ) {}

  async handle(command: CreatorOrderCommand): Promise<void> {
    await this.orderRecipeExistenceChecker.ensureRecipeExists(
      command.data.recipeId
    );

    const order = Order.create({
      recipeId: command.data.recipeId,
      status: command.data.status,
    });

    await this.orderRepository.create(order);

    await this.publishEvents(order);
  }
  private async publishEvents(order: Order): Promise<void> {
    const events = order.pullDomainEvents();

    await this.eventStore.saveEvents(order.getId(), events, 0);
    await this.eventBus.publishAll(events);
  }
}
