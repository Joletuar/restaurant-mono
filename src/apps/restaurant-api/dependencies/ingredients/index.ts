import { FinderIngredientByIdQueryHandler } from '@src/bounded-contexts/ingredients/application/queries/finder-ingredient-by-id/finder-ingredient-by-id.query-handler';
import { FinderIngredientById } from '@src/bounded-contexts/ingredients/application/use-cases/finder-ingredient-by-id/finder-ingredient-by-id.use-case';
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
  });

  // Use Cases

  container.register({
    key: 'FinderIngredientById',
    factory: () =>
      new FinderIngredientById(container.resolve('IngredientRepository')),
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
    'FinderIngredientByIdQuery',
    container.resolve<FinderIngredientByIdQueryHandler>(
      'FinderIngredientByIdQueryHandler'
    )
  );

  // Controllers

  // Routes
};
