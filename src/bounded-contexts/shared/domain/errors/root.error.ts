import type { AppErrorCode } from '../app-error-code.enum';

export class RootError extends Error {
  constructor(
    message: string,
    readonly appErrorCode: AppErrorCode,
    readonly errors: string[]
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}
