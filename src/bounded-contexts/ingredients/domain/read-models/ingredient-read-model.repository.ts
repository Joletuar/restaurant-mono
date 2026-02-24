import type { IngredientReadModel } from '@src/bounded-contexts/ingredients/application/read-models/ingredient.read-model';
import type { ReadModelRepository } from '@src/bounded-contexts/shared/domain/read-model.repository';

export type IngredientReadModelRepository =
  ReadModelRepository<IngredientReadModel>;
