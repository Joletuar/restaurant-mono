import { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

import { OrderDto } from '../order.dto';
import { OrderMapper } from '../order.mapper';

export class FinderOrderById {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<OrderDto> {
    const order = await this.orderRepository.findById(
      IdValueObject.fromPrimitives(id)
    );

    if (!order) {
      throw new NotFoundError('Order not found', [
        `Order with id <${id}> not found.`,
      ]);
    }

    return OrderMapper.toDto(order);
  }
}
