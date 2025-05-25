export interface Query {
  readonly queryName: string;
  readonly id: string;
  readonly metadata?: Record<string, unknown>;
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

export interface QueryBus {
  ask<Q extends Query, R extends QueryResponse<unknown>>(query: Q): Promise<R>;
  register<Q extends Query, R extends QueryResponse<unknown>>(
    queryName: Q,
    handler: QueryHandler<Q, R>
  ): void;
}
