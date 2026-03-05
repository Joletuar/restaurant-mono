// Controllers
import { HealthCheckController } from '@src/apps/restaurant-api/http/rest-api/controllers/health-check.controller';
import { HealthCheckRouteRegistrar } from '@src/apps/restaurant-api/http/rest-api/routes/health-check.route';

import type { DependencyContainer } from '../dependency-container';

export const registerHealthCheckDependencies = (
  container: DependencyContainer
): void => {
  // Controllers

  container.register({
    key: 'HealthCheckController',
    factory: () => new HealthCheckController(),
  });

  // Routes

  container.register({
    key: 'HealthCheckRouteRegistrar',
    factory: () =>
      new HealthCheckRouteRegistrar(container.resolve('HealthCheckController')),
  });
};
