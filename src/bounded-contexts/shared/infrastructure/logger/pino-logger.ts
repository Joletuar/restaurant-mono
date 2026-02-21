import { type LoggerOptions, pino } from 'pino';
import pretty, { type PrettyStream } from 'pino-pretty';

import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface.ts';

const env =
  (process.env['NODE_ENV'] as 'production' | 'test' | 'development') ??
  'development';

export class PinoLogger implements Logger {
  private readonly pinoOpt: Record<typeof env, LoggerOptions> = {
    development: {
      level: 'trace',
    },
    production: {
      level: 'warn',
    },
    test: { level: 'warn' },
  };

  private readonly prettyOpt: Record<typeof env, PrettyStream> = {
    development: pretty({
      translateTime: 'HH:MM:ss Z',
      minimumLevel: 'debug',
      colorize: true,
    }),
    production: pretty({
      translateTime: 'HH:MM:ss Z',
      minimumLevel: 'warn',
    }),
    test: pretty({ translateTime: 'HH:MM:ss Z', minimumLevel: 'warn' }),
  };

  private readonly logger = pino(this.pinoOpt[env], this.prettyOpt[env]);

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
    this.logger.debug(data, msg, args);
  }
}
