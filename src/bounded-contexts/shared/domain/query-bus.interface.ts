export interface Query {
  readonly _id: string;
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
  execute<Q extends Query, R extends QueryResponse<unknown>>(
    q: Q,
    next: (query: Q) => Promise<R>
  ): Promise<R>;
}

export interface QueryClass {
  new (...args: any[]): Query;
}

export interface QueryBus {
  register<Q extends Query, R extends QueryResponse<unknown>>(
    query: QueryClass,
    handler: QueryHandler<Q, R>
  ): void;

  dispatch<Q extends Query, R extends QueryResponse<unknown>>(
    query: Q
  ): Promise<R>;

  addMiddlewares(middleware: QueryMiddleware): void;
}
