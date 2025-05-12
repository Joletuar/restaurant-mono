import { Order } from '@src/modules/orders/domain/order.entity';
import { OrderRepository } from '@src/modules/orders/domain/order.repository';
import { DateValueObject } from '@src/modules/shared/domain/value-objects/date.value-object';
import { IdValueObject } from '@src/modules/shared/domain/value-objects/id.value-object';

import { OrderCreatorDto } from './order-creator.dto';

export class OrderCreator {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderCreatorDto: OrderCreatorDto): Promise<void> {
    await this.ensureIsValidRecipe(orderCreatorDto.recipeId);

    const order = Order.fromPrimitives({
      id: IdValueObject.generateId(),
      recipeId: orderCreatorDto.recipeId,
      status: orderCreatorDto.status,
      createdAt: DateValueObject.generateDate().value,
      updatedAt: DateValueObject.generateDate().value,
    });

    await this.orderRepository.create(order);
  }

  private async ensureIsValidRecipe(recipeId: string): Promise<void> {
    // TODO: Implement the logic to ensure the recipe is valid
  }
}
