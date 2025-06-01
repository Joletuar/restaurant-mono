import dependencyContainer from '@src/apps/restaurant-api/dependencies';
import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';
import {
  type Query,
  type QueryBus,
  type QueryClass,
  type QueryHandler,
  type QueryMiddleware,
  type QueryResponse,
} from '@src/bounded-contexts/shared/domain/query-bus.interface';

export class InMemoryQueryBus implements QueryBus {
  private _logger?: Logger;

  private readonly handlers: Map<QueryClass, QueryHandler<any, any>> =
    new Map();
  private middlewares: QueryMiddleware[] = [];

  register<Q extends Query, R extends QueryResponse<unknown>>(
    query: QueryClass,
    handler: QueryHandler<Q, R>
  ): void {
    if (this.handlers.has(query)) {
      this.logger.warn(
        {},
        `Query handler <${query.name}> is already registered.`
      );

      return;
    }

    this.handlers.set(query, handler);
  }

  async dispatch<Q extends Query, R extends QueryResponse<unknown>>(
    query: Q
  ): Promise<R> {
    const handler = this.handlers.get(query.constructor as QueryClass);

    if (!handler) {
      throw new Error(`No handler registered for <${query.constructor.name}>.`); // TODO: USE CUSTOM ERROR
    }

    let next = (query: Q): Promise<R> => handler.handle(query);

    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i]!;
      const currentNext = next;

      next = (query) => middleware.execute(query, currentNext);
    }

    return next(query);
  }

  addMiddleware(middleware: QueryMiddleware): void {
    if (this.middlewares.find((m) => m === middleware)) {
      this.logger.warn(
        {},
        `Middleware <${middleware.constructor.name}> is already registered.`
      );

      return;
    }

    this.middlewares.push(middleware);
  }

  private get logger(): Logger {
    if (!this._logger) {
      this._logger = dependencyContainer.resolve('Logger');
    }
    return this._logger;
  }
}
