export interface RecipeExistenceChecker {
  ensureRecipeExists(recipeId: string): Promise<void>;
}
