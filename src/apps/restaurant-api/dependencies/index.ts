import { PinoLogger } from '@src/bounded-contexts/shared/infraestructure/logger/pino-logger';

import { ConfigProvider } from '../config/app-config';
import type { HttpServer } from '../http/http-server.interface';
import { FastifyRestApiServer } from '../http/rest-api/fastify-rest-api-server';
import { DependencyContainer } from './dependency-container';
import { registerHealthCheckDependencies } from './health-check';
import { registerIngredientsDependencies } from './ingredients';
import { registerOrderDependencies } from './orders';
import { registerRecipesDependencies } from './recipes';

const config = ConfigProvider.getConfig();
const dependencyContainer: DependencyContainer = new DependencyContainer();
let isBooststrapped = false;

if (!isBooststrapped) {
  (function bootstrap(): void {
    // Global

    dependencyContainer.register({
      key: 'Logger',
      factory: () => new PinoLogger(),
    });

    // Routes

    registerHealthCheckDependencies(dependencyContainer);
    registerIngredientsDependencies(dependencyContainer);
    registerRecipesDependencies(dependencyContainer);
    registerOrderDependencies(dependencyContainer);

    // App

    dependencyContainer.register<HttpServer>({
      key: 'HttpServer',
      factory: () =>
        new FastifyRestApiServer({
          port: config.http.port,
          environment: config.http.environment,
          routes: [
            dependencyContainer.resolve('HealthCheckRouteRegistar'),
            dependencyContainer.resolve('OrderRouteRegistrar'),
          ],
        }),
    });

    isBooststrapped = true;
  })();
}

export default dependencyContainer;
