import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infraestructure.error';

export class QuerydHandlerNotRegisteredError extends InfrastructureError {
  constructor(queryName: string) {
    super(
      `Handler not registered for query: ${queryName}`,
      [`No handler found for query: ${queryName}`],
      undefined,
      true
    );

    this.name = 'HandlerNotRegisteredError';
  }
}
