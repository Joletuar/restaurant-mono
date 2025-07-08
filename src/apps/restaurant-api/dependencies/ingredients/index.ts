import { IngredientController } from '@src/apps/restaurant-api/http/rest-api/controllers/ingredient.controller';
import { FinderIngredientByIdQuery } from '@src/bounded-contexts/ingredients/application/queries/finder-ingredient-by-id/finder-ingredient-by-id.query';
import { FinderIngredientByIdQueryHandler } from '@src/bounded-contexts/ingredients/application/queries/finder-ingredient-by-id/finder-ingredient-by-id.query-handler';
import { GetterAllIngredientsQuery } from '@src/bounded-contexts/ingredients/application/queries/getter-all-ingredients/getter-all-ingredients.query';
import { GetterAllIngredientsQueryHandler } from '@src/bounded-contexts/ingredients/application/queries/getter-all-ingredients/getter-all-ingredients.query-handler';
import { InMemoryIngredientRepository } from '@src/bounded-contexts/ingredients/infraestructure/persistence/in-memory-ingredient.repository';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import { IngredientRoute } from '../../http/rest-api/routes/ingredient.route';
import type { DependencyContainer } from '../dependency-container';

export const registerIngredientsDependencies = (
  container: DependencyContainer
): void => {
  // Repositories

  container.register({
    key: 'IngredientRepository',
    factory: () => new InMemoryIngredientRepository(),
    lifetime: 'singleton',
  });

  // Query Handlers

  container.register({
    key: 'FinderIngredientByIdQueryHandler',
    factory: () =>
      new FinderIngredientByIdQueryHandler(
        container.resolve('IngredientRepository')
      ),
  });

  container.register({
    key: 'GetterAllIngredientsQueryHandler',
    factory: () =>
      new GetterAllIngredientsQueryHandler(
        container.resolve('IngredientRepository')
      ),
  });

  const queryBus = container.resolve<QueryBus>('QueryBus');

  queryBus.register(
    FinderIngredientByIdQuery,
    container.resolve<FinderIngredientByIdQueryHandler>(
      'FinderIngredientByIdQueryHandler'
    )
  );

  queryBus.register(
    GetterAllIngredientsQuery,
    container.resolve<GetterAllIngredientsQueryHandler>(
      'GetterAllIngredientsQueryHandler'
    )
  );

  // Controllers

  container.register({
    key: 'IngredientController',
    factory: () =>
      new IngredientController(container.resolve<QueryBus>('QueryBus')),
  });

  // Routes

  container.register({
    key: 'IngredientRouteRegistrar',
    factory: () =>
      new IngredientRoute(container.resolve('IngredientController')),
  });
};
