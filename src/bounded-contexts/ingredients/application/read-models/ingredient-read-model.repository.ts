import type { ReadModelRepository } from '@src/bounded-contexts/shared/application/read-model.repository';

import type { IngredientReadModel } from './ingredient.read-model';

export type IngredientReadModelRepository =
  ReadModelRepository<IngredientReadModel>;
