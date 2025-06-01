import type { QueryBus } from '@src/bounded-contexts/shared/domain/query-bus.interface';
import { InMemoryCommandBus } from '@src/bounded-contexts/shared/infraestructure/cqrs-event-bus/in-memory-command-event-bus';
import { InMemoryQueryBus } from '@src/bounded-contexts/shared/infraestructure/cqrs-event-bus/in-memory-query-bus-event-bus';
import { LoggerQueryMiddleware } from '@src/bounded-contexts/shared/infraestructure/cqrs-event-bus/middlewares/logger.query-middleware';

import type { DependencyContainer } from '../dependency-container';

export const registerSharedDependencies = (
  container: DependencyContainer
): void => {
  // Command and Query Buses

  container.register({
    key: 'CommandBus',
    lifetime: 'singleton',
    factory: () => new InMemoryCommandBus(),
  });

  container.register({
    key: 'QueryBus',
    lifetime: 'singleton',
    factory: () => new InMemoryQueryBus(),
  });

  const queryBus = container.resolve<QueryBus>('QueryBus');

  // Command and Query Middlewares

  container.register({
    key: 'LoggerQueryMiddleware',
    factory: () => new LoggerQueryMiddleware(),
  });

  queryBus.addMiddleware(container.resolve('LoggerQueryMiddleware'));
};
