import { ApplicationError } from './application.error';

/**
 * NotFoundError class
 * This class represents an error that occurs when a resource is not found.
 * It extends the ApplicationError class.
 */

export class NotFoundError extends ApplicationError {
  constructor(message: string, errors: string[]) {
    super(message, errors);

    this.name = this.constructor.name;
  }
}
