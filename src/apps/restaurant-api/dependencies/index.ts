import { PinoLogger } from '@src/bounded-contexts/shared/infraestructure/logger/pino-logger';

import { ConfigProvider } from '../config/app-config';
import type { HttpServer } from '../http/http-server.interface';
import { FastifyRestApiServer } from '../http/rest-api/fastify-rest-api-server';
import { DependencyContainer } from './dependency-container';
import { registerHealthCheckDependencies } from './health-check';
import { registerIngredientsDependencies } from './ingredients';
import { registerOrderDependencies } from './orders';
import { registerRecipesDependencies } from './recipes';
import { registerSharedDependencies } from './shared';

const config = ConfigProvider.getConfig();

/**
 ** TODO: añadir TOKENS o CONSTANTES para todas las depedencias registradas para
 ** no tener magic strings o problemas de nombres incorrectos
 */

export default (function bootstrap(): DependencyContainer {
  const dependencyContainer: DependencyContainer = new DependencyContainer();

  dependencyContainer.register({
    key: 'Logger',
    factory: () => new PinoLogger(),
  });

  registerSharedDependencies(dependencyContainer);

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
          dependencyContainer.resolve('RecipeRouteRegistrar'),
          dependencyContainer.resolve('IngredientRouteRegistrar'),
          dependencyContainer.resolve('OrderRouteRegistrar'),
        ],
      }),
  });

  return dependencyContainer;
})();
