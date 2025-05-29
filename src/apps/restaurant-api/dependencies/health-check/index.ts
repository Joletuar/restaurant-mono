// Controllers
import { HealthCheckController } from '@src/apps/restaurant-api/http/rest-api/controllers/health-check.controller';
import { HealthCheckRouteRegistar } from '@src/apps/restaurant-api/http/rest-api/routes/health-check.route';

import type { DependencyContainer } from '../dependency-container';

export const registerHealthCheckDependencies = (
  container: DependencyContainer
): void => {
  // Controllers

  const controller = new HealthCheckController();

  container.register('HealthCheckController', () => controller);

  // Routes

  const routes = new HealthCheckRouteRegistar(
    container.resolve('HealthCheckController')
  );

  container.register('HealthCheckRouteRegistar', () => routes);
};
