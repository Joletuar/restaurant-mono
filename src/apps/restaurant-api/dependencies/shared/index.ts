import type { CommandBus } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { InMemoryCommandBus } from '@src/bounded-contexts/shared/infraestructure/bus/command-bus/in-memory-command-event-bus';
import { LoggerCommandMiddleware } from '@src/bounded-contexts/shared/infraestructure/bus/command-bus/middlewares/logger.command-middleware';
import { InMemoryQueryBus } from '@src/bounded-contexts/shared/infraestructure/bus/query-bus/in-memory-query-bus-event-bus';
import { LoggerQueryMiddleware } from '@src/bounded-contexts/shared/infraestructure/bus/query-bus/middlewares/logger.query-middleware';

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

  const commandBus = container.resolve<CommandBus>('CommandBus');

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

  container.register({
    key: 'LoggerCommandMiddleware',
    factory: () => new LoggerCommandMiddleware(),
  });

  queryBus.addMiddleware(container.resolve('LoggerQueryMiddleware'));
  commandBus.addMiddleware(container.resolve('LoggerCommandMiddleware'));
};
