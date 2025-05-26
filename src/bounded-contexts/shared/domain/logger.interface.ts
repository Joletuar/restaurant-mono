export interface Logger {
  info(data: unknown, msg: string, ...args: unknown[]): void;
  warn(data: unknown, msg: string, ...args: unknown[]): void;
  error(data: unknown, msg: string, ...args: unknown[]): void;
}

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}
