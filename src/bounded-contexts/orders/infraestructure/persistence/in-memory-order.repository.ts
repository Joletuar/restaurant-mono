import { Order } from '@src/bounded-contexts/orders/domain/order.entity';
import type { OrderRepository } from '@src/bounded-contexts/orders/domain/order.repository';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infraestructure.error';
import { RootError } from '@src/bounded-contexts/shared/domain/errors/root.error';
import type { Nullable } from '@src/bounded-contexts/shared/domain/nullable.type';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { LogMethod } from '@src/bounded-contexts/shared/infraestructure/logger/decorators/log-method.decorator';

import { OrderStatus } from '../../domain/value-objects/order-status.value-object';

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, Order> = new Map<string, Order>();

  constructor(
    initialOrders: Order[] = [
      Order.fromPrimitives({
        recipeId: IdValueObject.generateId().value,
        status: OrderStatus.createCompleted().value,
      }),
    ]
  ) {
    initialOrders.forEach((order) => {
      this.orders.set(order.getId(), order);
    });
  }

  @LogMethod({
    logParams: true,
    logResult: true,
  })
  async findById(id: IdValueObject): Promise<Nullable<Order>> {
    try {
      const order = this.orders.get(id.value);

      return order || null;
    } catch (error) {
      this.errorHandler(error);
      return null;
    }
  }

  @LogMethod({
    logParams: true,
    logResult: true,
  })
  async getAll(): Promise<Order[]> {
    try {
      return Array.from(this.orders.values());
    } catch (error) {
      this.errorHandler(error);
      return [];
    }
  }

  @LogMethod({
    logParams: true,
    logResult: true,
  })
  async update(order: Order): Promise<void> {
    try {
      const id = order.getId();

      this.orders.set(id, order);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  @LogMethod({
    logParams: true,
    logResult: true,
  })
  async create(order: Order): Promise<void> {
    try {
      const id = order.getId();

      this.orders.set(id, order);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  errorHandler(error: unknown): void {
    if (error instanceof RootError) throw error;

    throw new InfrastructureError(
      'An unexpected error occurred in the Order epository',
      [(error as Error)?.message || 'Unknown error'],
      error instanceof Error ? error : undefined,
      true
    );
  }
}
