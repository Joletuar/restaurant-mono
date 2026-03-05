import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infrastructure.error';

export class QueryHandlerNotRegisteredError extends InfrastructureError {
  constructor(queryName: string) {
    super(`Handler not registered for query: ${queryName}`, null, true);

    this.name = 'HandlerNotRegisteredError';
  }
}
