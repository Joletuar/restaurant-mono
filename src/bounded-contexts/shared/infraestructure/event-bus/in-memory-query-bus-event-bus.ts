import dependencyContainer from '@src/apps/restaurant-api/dependencies';
import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';
import {
  type Query,
  type QueryBus,
  type QueryHandler,
  type QueryMiddleware,
  type QueryResponse,
} from '@src/bounded-contexts/shared/domain/query-bus.interface';

export class InMemoryQueryBus implements QueryBus {
  private readonly logger: Logger = dependencyContainer.resolve('Logger');

  private readonly handlers: Map<string, QueryHandler> = new Map();
  private middlewares: QueryMiddleware[] = [];

  register<Q extends Query>(query: Q, handler: QueryHandler): void {
    if (this.handlers.has(query.queryName)) {
      this.logger.warn(
        {},
        `Query handler <${query.queryName}> is already registered.`
      );

      return;
    }

    this.handlers.set(query.queryName, handler);
  }

  async ask<Q extends Query, R extends QueryResponse<unknown>>(
    query: Q
  ): Promise<R> {
    const handler = this.handlers.get(query.queryName);

    if (!handler) {
      throw new Error(`No handler registered for <${query.queryName}>.`); // TODO: USE CUSTOM ERROR
    }

    let next = (query: Q): Promise<R> => handler.handle(query);

    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i]!;
      const currentNext = next;

      next = (query) => middleware.execute(query, currentNext);
    }

    return next(query);
  }

  addMiddlewares(middleware: QueryMiddleware): void {
    if (this.middlewares.find((m) => m === middleware)) {
      this.logger.warn(
        {},
        `Middleware <${middleware.queryMidlewareName}> is already registered.`
      );

      return;
    }

    this.middlewares.push(middleware);
  }
}
