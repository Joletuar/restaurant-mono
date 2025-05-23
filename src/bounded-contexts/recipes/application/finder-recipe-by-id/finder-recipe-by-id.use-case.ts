import { RecipeRepository } from '@src/modules/recipes/domain/recipe.repository';
import { NotFoundError } from '@src/modules/shared/domain/errors/not-found.error';
import { IdValueObject } from '@src/modules/shared/domain/value-objects/id.value-object';

import { RecipeDto } from '../recipe.dto';
import { RecipeMapper } from '../recipe.mapper';

export class FinderRecipeById {
  constructor(private readonly repository: RecipeRepository) {}

  async execute(id: string): Promise<RecipeDto> {
    const recipe = await this.repository.findById(
      IdValueObject.fromPrimitives(id)
    );

    if (!recipe) {
      throw new NotFoundError('Recipe not found', [
        `Recipe with id <${id}> not found.`,
      ]);
    }

    return RecipeMapper.toDto(recipe);
  }
}
