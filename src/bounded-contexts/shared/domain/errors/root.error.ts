import type { AppErrorCode } from '../app-error-code.enum';

export abstract class RootError extends Error {
  constructor(
    message: string,
    readonly appErrorCode: AppErrorCode,
    readonly errors: string[]
  ) {
    super(message);

    this.name = 'RootError';
  }
}
