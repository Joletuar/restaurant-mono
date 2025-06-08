import { FinderIngredientByIdQuery } from '@src/bounded-contexts/ingredients/application/queries/finder-ingredient-by-id/finder-ingredient-by-id.query';
import { FinderIngredientByIdQueryHandler } from '@src/bounded-contexts/ingredients/application/queries/finder-ingredient-by-id/finder-ingredient-by-id.query-handler';
import { InMemoryIngredientRepository } from '@src/bounded-contexts/ingredients/infraestructure/persistence/in-memory-ingredient.repository';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/query-bus.interface';

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

  const queryBus = container.resolve<QueryBus>('QueryBus');

  queryBus.register(
    FinderIngredientByIdQuery,
    container.resolve<FinderIngredientByIdQueryHandler>(
      'FinderIngredientByIdQueryHandler'
    )
  );

  // Controllers

  // Routes
};
