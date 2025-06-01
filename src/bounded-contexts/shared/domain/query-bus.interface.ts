export interface Query {
  readonly queryName: string;
  readonly id: string;
  readonly metadata?: Record<string, unknown>;
}

export interface QueryResponse<Data> {
  readonly data: Data;
}

export interface QueryHandler {
  handle<Q extends Query, R extends QueryResponse<unknown>>(
    query: Q
  ): Promise<R>;
}

export interface QueryMiddleware {
  queryMidlewareName: string;

  execute<Q extends Query, R extends QueryResponse<unknown>>(
    q: Q,
    next: (query: Q) => Promise<R>
  ): Promise<R>;
}

export interface QueryBus {
  register<Q extends Query>(query: Q, handler: QueryHandler): void;

  ask<Q extends Query, R extends QueryResponse<unknown>>(query: Q): Promise<R>;

  addMiddlewares(middleware: QueryMiddleware): void;
}
