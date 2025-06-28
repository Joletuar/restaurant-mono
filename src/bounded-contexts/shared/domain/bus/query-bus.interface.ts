export interface Query {
  readonly _id: string;
  readonly _metadata?: Record<string, unknown>;
}

export interface QueryResponse<Data> {
  readonly data: Data;
}

export interface QueryHandler<Q extends Query, Data = unknown> {
  handle(query: Q): Promise<QueryResponse<Data>>;
}

export interface QueryMiddleware {
  execute<Q extends Query, Data = unknown>(
    query: Q,
    next: (query: Q) => Promise<QueryResponse<Data>>
  ): Promise<QueryResponse<Data>>;
}

export interface QueryClass<Q extends Query = Query> {
  new (...args: any[]): Q;
}

export interface QueryBus {
  register<Q extends Query, Data = unknown>(
    query: QueryClass<Q>,
    handler: QueryHandler<Q, Data>
  ): void;

  dispatch<Q extends Query, Data = unknown>(
    query: Q
  ): Promise<QueryResponse<Data>>;

  addMiddleware(middleware: QueryMiddleware): void;
}
