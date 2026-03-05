export interface IngredientsExistenceChecker {
  ensureIngredientsExist(ids: string[]): Promise<void>;
}
