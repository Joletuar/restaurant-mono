import { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { FinderRecipeById } from '@src/bounded-contexts/recipes/application/finder-recipe-by-id/finder-recipe-by-id.use-case';
import { LogMethod } from '@src/bounded-contexts/shared/infraestructure/logger/decorators/log-method.decorator';

import type { CreatorOrderDto } from './creator-order.dto';

export class CreatorOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly finderRecipeById: FinderRecipeById
  ) {}

  @LogMethod({
    logParams: true,
    logResult: true,
  })
  async execute(creatorOrderDto: CreatorOrderDto): Promise<void> {
    await this.ensureIsValidRecipe(creatorOrderDto.recipeId);

    const order = Order.fromPrimitives({
      recipeId: creatorOrderDto.recipeId,
      status: creatorOrderDto.status,
    });

    await this.orderRepository.create(order);
  }

  private async ensureIsValidRecipe(recipeId: string): Promise<void> {
    await this.finderRecipeById.execute(recipeId);
  }
}
