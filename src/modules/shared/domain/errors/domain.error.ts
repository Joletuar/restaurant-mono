import { AppErrorCode } from '../app-error-code.enum';
import { RootError } from './root.error';

/**
 * DomainError is a custom error class that extends the RootError class.
 * It represents a domain-level error with a specific error code and additional error messages.
 */

export class DomainError extends RootError {
  constructor(message: string, errors: string[]) {
    super(message, AppErrorCode.DOMAIN_ERROR, errors);

    this.name = this.constructor.name;
  }
}
