import { AppErrorCode } from '../app-error-code.enum';
import { RootError } from './root.error';

/**
 * ApplicationError is a custom error class that extends the RootError class.
 * It represents an application-level error with a specific error code and additional error messages.
 */

export abstract class ApplicationError extends RootError {
  constructor(message: string) {
    super(message, AppErrorCode.APPLICATION_ERROR);

    this.name = 'ApplicationError';
  }
}
