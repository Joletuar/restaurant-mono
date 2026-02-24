import { AppErrorCode } from '../app-error-code.enum';
import { RootError } from './root.error';

export abstract class NotFoundError extends RootError {
  constructor(message: string) {
    super(message, AppErrorCode.NOT_FOUND);

    this.name = 'NotFoundError';
  }
}
