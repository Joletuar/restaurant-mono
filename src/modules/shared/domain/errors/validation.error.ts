import { DomainError } from './domain.error';

/**
 * ValidationError class
 * This class represents an error that occurs during validation.
 * It extends the DomainError class.
 */

export class ValidationError extends DomainError {
  constructor(message: string, errors: string[]) {
    super(message, errors);

    this.name = this.constructor.name;
  }
}
