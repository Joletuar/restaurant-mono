import { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { FinderRecipeById } from '@src/bounded-contexts/recipes/application/finder-recipe-by-id/finder-recipe-by-id.use-case';

import { OrderCreatorDto } from './order-creator.dto';

export class CreatorOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly finderRecipeById: FinderRecipeById
  ) {}

  async execute(orderCreatorDto: OrderCreatorDto): Promise<void> {
    await this.ensureIsValidRecipe(orderCreatorDto.recipeId);

    const order = Order.fromPrimitives({
      recipeId: orderCreatorDto.recipeId,
      status: orderCreatorDto.status,
    });

    await this.orderRepository.create(order);
  }

  private async ensureIsValidRecipe(recipeId: string): Promise<void> {
    await this.finderRecipeById.execute(recipeId);
  }
}
