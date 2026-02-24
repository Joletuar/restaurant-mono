import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';

export class IngredientNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Ingredient with id <${id}> not found.`);

    this.name = 'IngredientNotFoundError';
  }
}
