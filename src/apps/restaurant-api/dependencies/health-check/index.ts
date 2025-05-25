// Controllers
import { HealthCheckController } from '@src/apps/restaurant-api/http/rest-api/controllers/health-check.controller';
import { HealthCheckRouteRegistar } from '@src/apps/restaurant-api/http/rest-api/routes/health-check.route';

import { dependencyContainer } from '../dependency-container';

const controller = new HealthCheckController();

dependencyContainer.register('HealthCheckController', () => controller);

// Routes

export const routes = new HealthCheckRouteRegistar(
  dependencyContainer.resolve('HealthCheckController')
);

dependencyContainer.register('HealthCheckRouteRegistar', () => routes);
