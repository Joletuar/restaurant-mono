import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';

export class NotFoundOrderError extends NotFoundError {
  constructor() {
    super('Order not found');

    this.name = 'NotFoundOrderError';
  }
}
