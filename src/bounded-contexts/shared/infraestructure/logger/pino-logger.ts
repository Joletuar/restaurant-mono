import { FastifyInstance } from 'fastify';

import { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';

export class PinoLogger implements Logger {
  constructor(private readonly logger: FastifyInstance['log']) {}

  info(data: unknown, msg: string, ...args: unknown[]): void {
    this.logger.info(data, msg, args);
  }

  warn(data: unknown, msg: string, ...args: unknown[]): void {
    this.logger.warn(data, msg, args);
  }

  error(data: unknown, msg: string, ...args: unknown[]): void {
    this.logger.error(data, msg, args);
  }
}
