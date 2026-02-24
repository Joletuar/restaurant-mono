import {
  Order,
  type OrderPrimitives,
} from '@src/bounded-contexts/orders/domain/order.entity';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infrastructure.error';
import { RootError } from '@src/bounded-contexts/shared/domain/errors/root.error';
import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { RootRespository } from '@src/bounded-contexts/shared/domain/root.repository';
import type { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

export class InMemoryOrderRepository
  extends RootRespository
  implements OrderRepository
{
  private orders: Map<string, OrderPrimitives> = new Map<
    string,
    OrderPrimitives
  >();

  constructor(initialOrders: Order[] = []) {
    super();

    initialOrders.forEach((order) => {
      this.orders.set(order.getId(), order.toPrimitives());
    });
  }

  async findById(id: IdValueObject): Promise<Nullable<Order>> {
    try {
      const order = this.orders.get(id.value);

      return order ? Order.rehydrate(order) : null;
    } catch (error) {
      this.errorHandler(error);
      return null;
    }
  }

  async getAll(): Promise<Order[]> {
    try {
      return Array.from(this.orders.values()).map((order) =>
        Order.rehydrate(order)
      );
    } catch (error) {
      this.errorHandler(error);
      return [];
    }
  }

  async update(order: Order): Promise<void> {
    try {
      const id = order.getId();

      this.orders.set(id, order.toPrimitives());
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async create(order: Order): Promise<void> {
    try {
      const id = order.getId();

      this.orders.set(id, order.toPrimitives());
    } catch (error) {
      this.errorHandler(error);
    }
  }

  errorHandler(error: unknown): void {
    if (error instanceof RootError) throw error;

    throw new InfrastructureError(
      'An unexpected error occurred in the Order Repository',
      error instanceof Error ? error : undefined,
      true
    );
  }
}
