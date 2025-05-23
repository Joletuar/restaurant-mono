import { AppErrorCode } from '../app-error-code.enum';
import { RootError } from './root.error';

/**
 * ApplicationError is a custom error class that extends the RootError class.
 * It represents an application-level error with a specific error code and additional error messages.
 */

export class ApplicationError extends RootError {
  constructor(message: string, errors: string[]) {
    super(message, AppErrorCode.APPLICATION_ERROR, errors);

    this.name = this.constructor.name;
  }
}
