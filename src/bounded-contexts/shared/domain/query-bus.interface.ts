export interface Query {
  readonly _id: string;
  readonly _name: string;
  readonly _metadata?: Record<string, unknown>;
}

export interface QueryResponse<Data> {
  readonly data: Data;
}

export interface QueryHandler<
  Q extends Query,
  R extends QueryResponse<unknown>,
> {
  handle(query: Q): Promise<R>;
}

export interface QueryMiddleware {
  readonly _name: string;

  execute<Q extends Query, R extends QueryResponse<unknown>>(
    q: Q,
    next: (query: Q) => Promise<R>
  ): Promise<R>;
}

export interface QueryBus {
  register<Q extends Query, R extends QueryResponse<unknown>>(
    queryName: string,
    handler: QueryHandler<Q, R>
  ): void;

  ask<Q extends Query, R extends QueryResponse<unknown>>(query: Q): Promise<R>;

  addMiddlewares(middleware: QueryMiddleware): void;
}
