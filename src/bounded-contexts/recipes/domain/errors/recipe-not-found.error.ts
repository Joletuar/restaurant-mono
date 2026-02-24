import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';

export class RecipeNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Recipe not found <${id}>`);

    this.name = 'RecipeNotFoundError';
  }
}
