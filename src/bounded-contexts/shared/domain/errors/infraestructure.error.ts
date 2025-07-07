import { AppErrorCode } from '../app-error-code.enum';
import { RootError } from './root.error';

/**
 * InfrastructureError is a custom error class that extends the RootError class.
 * It represents an infrastructure-level error with a specific error code and additional error messages.
 */

export class InfrastructureError extends RootError {
  constructor(
    message: string,
    errors: string[],
    readonly originalError?: Error,
    readonly isCritical: boolean = false
  ) {
    super(message, AppErrorCode.INFRASTRUCTURE_ERROR, errors);

    this.name = this.constructor.name;
  }
}
