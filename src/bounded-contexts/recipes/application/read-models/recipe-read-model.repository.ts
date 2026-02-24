import type { ReadModelRepository } from '@src/bounded-contexts/shared/application/read-model.repository';

import type { RecipeReadModel } from './recipe.read-model';

export type RecipeReadModelRepository = ReadModelRepository<RecipeReadModel>;
