import pino, { type LoggerOptions } from 'pino';

import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';

export class PinoLogger implements Logger {
  private readonly opt = {
    development: {
      transport: {
        target: 'pino-pretty',
        level: 'trace',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true,
        },
      },
    } satisfies LoggerOptions,
    production: {} satisfies LoggerOptions,
    test: {} satisfies LoggerOptions,
  };

  private readonly logger = pino(
    this.opt[
      (process.env['NODE_ENV'] as 'development' | 'production' | 'test') ??
        'development'
    ]
  );

  constructor() {}

  info(data: unknown, msg: string, ...args: unknown[]): void {
    this.logger.info(data, msg, args);
  }

  warn(data: unknown, msg: string, ...args: unknown[]): void {
    this.logger.warn(data, msg, args);
  }

  error(data: unknown, msg: string, ...args: unknown[]): void {
    this.logger.error(data, msg, args);
  }

  debug(data: unknown, msg: string, ...args: unknown[]): void {
    if (process.env['NODE_ENV'] !== 'production') {
      this.logger.debug(data, msg, args);
    }
  }
}
