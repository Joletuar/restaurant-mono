import { InMemoryCommandBus } from '@src/bounded-contexts/shared/infraestructure/event-bus/in-memory-command-event-bus';
import { InMemoryQueryBus } from '@src/bounded-contexts/shared/infraestructure/event-bus/in-memory-query-bus-event-bus';

import type { DependencyContainer } from '../dependency-container';

export const registerSharedDependencies = (
  container: DependencyContainer
): void => {
  container.register({
    key: 'CommandBus',
    lifetime: 'singleton',
    factory: () => new InMemoryQueryBus(),
  });

  container.register({
    key: 'QueryBus',
    lifetime: 'singleton',
    factory: () => new InMemoryCommandBus(),
  });
};
