import { Recipe } from '../domain/recipe.entity';
import type { RecipeDto } from './recipe.dto';

export class RecipeMapper {
  static toDto(recipe: Recipe): RecipeDto {
    const { id, createdAt, ingredientsIds, updatedAt } = recipe.toPrimitives();

    return {
      id,
      ingredientsIds,
      createdAt,
      updatedAt,
    };
  }
}
