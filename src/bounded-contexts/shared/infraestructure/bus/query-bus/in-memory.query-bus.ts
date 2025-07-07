import dependencyContainer from '@src/apps/restaurant-api/dependencies';
import {
  type Query,
  type QueryBus,
  type QueryClass,
  type QueryHandler,
  type QueryMiddleware,
  type QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';

import { QuerydHandlerNotRegisteredError } from './query-handler-not-registered.error';

export class InMemoryQueryBus implements QueryBus {
  private _logger?: Logger;

  private readonly handlers: Map<QueryClass, QueryHandler<any, any>> =
    new Map();
  private middlewares: QueryMiddleware[] = [];

  register<Q extends Query, Data = unknown>(
    query: QueryClass<Q>,
    handler: QueryHandler<Q, Data>
  ): void {
    if (this.handlers.has(query)) {
      this.getLogger().warn(
        {},
        `Query handler <${query.name}> is already registered.`
      );

      return;
    }

    this.handlers.set(query, handler);
  }

  async dispatch<Q extends Query, Data = unknown>(
    query: Q
  ): Promise<QueryResponse<Data>> {
    const handler = this.handlers.get(query.constructor as QueryClass);

    if (!handler) {
      throw new QuerydHandlerNotRegisteredError(query.constructor.name);
    }

    let next = (query: Query): Promise<QueryResponse<Data>> =>
      handler.handle(query);

    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i]!;
      const currentNext = next;

      next = (query) => middleware.execute(query, currentNext);
    }

    return next(query);
  }

  addMiddleware(middleware: QueryMiddleware): void {
    if (this.middlewares.find((m) => m === middleware)) {
      this.getLogger().warn(
        {},
        `Middleware <${middleware.constructor.name}> is already registered.`
      );

      return;
    }

    this.middlewares.push(middleware);
  }

  private getLogger(): Logger {
    if (!this._logger) {
      this._logger = dependencyContainer.resolve('Logger');
    }
    return this._logger;
  }
}
