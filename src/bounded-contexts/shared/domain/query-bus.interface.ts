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
  execute(
    query: Query,
    next: (query: Query) => Promise<QueryResponse<unknown>>
  ): Promise<QueryResponse<unknown>>;
}

export interface QueryClass {
  new (...args: any[]): Query;
}

export interface QueryBus {
  register(
    query: QueryClass,
    handler: QueryHandler<Query, QueryResponse<unknown>>
  ): void;

  dispatch(query: Query): Promise<QueryResponse<unknown>>;

  addMiddleware(middleware: QueryMiddleware): void;
}
