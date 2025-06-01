import type { Order } from '../domain/order.entity';
import type { OrderDto } from './order.dto';

export class OrderMapper {
  static toDto(order: Order): OrderDto {
    const primitives = order.toPrimitives();

    return primitives;
  }

  static toDtoList(orders: Order[]): OrderDto[] {
    return orders.map((order) => this.toDto(order));
  }
}
