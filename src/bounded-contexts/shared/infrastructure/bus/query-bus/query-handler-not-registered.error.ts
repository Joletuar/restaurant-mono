import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infrastructure.error';

export class QuerydHandlerNotRegisteredError extends InfrastructureError {
  constructor(queryName: string) {
    super(
      `Handler not registered for query: ${queryName}`,
      [`No handler found for query: ${queryName}`],
      null,
      true
    );

    this.name = 'HandlerNotRegisteredError';
  }
}
