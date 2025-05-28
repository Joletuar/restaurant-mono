import { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { FinderRecipeById } from '@src/bounded-contexts/recipes/application/finder-recipe-by-id/finder-recipe-by-id.use-case';
import { LogLevel } from '@src/bounded-contexts/shared/domain/logger.interface';
import { LogMethod } from '@src/bounded-contexts/shared/infraestructure/logger/decorators/log-method.decorator';

import { OrderCreatorDto } from './order-creator.dto';

export class CreatorOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly finderRecipeById: FinderRecipeById
  ) {}

  @LogMethod({
    level: LogLevel.INFO,
    logParams: true,
    logResult: true,
  })
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
