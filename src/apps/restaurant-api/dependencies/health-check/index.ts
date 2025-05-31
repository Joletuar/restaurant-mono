// Controllers
import { HealthCheckController } from '@src/apps/restaurant-api/http/rest-api/controllers/health-check.controller';
import { HealthCheckRouteRegistar } from '@src/apps/restaurant-api/http/rest-api/routes/health-check.route';

import { DependencyContainer } from '../dependency-container';

export const registerHealthCheckDependencies = (
  container: DependencyContainer
): void => {
  // Controllers

  const controller = new HealthCheckController();

  container.register({
    key: 'HealthCheckController',
    factory: () => controller,
  });

  // Routes

  const routes = new HealthCheckRouteRegistar(
    container.resolve('HealthCheckController')
  );

  container.register({
    key: 'HealthCheckRouteRegistar',
    factory: () => routes,
  });
};
