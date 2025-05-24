import express from '@fastify/express';
import Fastify, { FastifyInstance } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';

import { HttpServer } from '../http-server.interface';
import { errorHandler } from './error-handler';
import { RouteRegistrar } from './routes/route-registar.interface';

const envToLogger = {
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
  } satisfies PinoLoggerOptions,
  production: true,
  test: false,
};

export type FastifyServerConfig = {
  port: number;
  environment: 'production' | 'development' | 'test';
  routes: RouteRegistrar[];
};

export class FastifyRestApiServer implements HttpServer<FastifyInstance> {
  private fastify: FastifyInstance;
  constructor(private readonly config: FastifyServerConfig) {
    this.fastify = Fastify({
      logger: envToLogger[this.config.environment] ?? envToLogger.development,
      requestIdHeader: 'x-request-id',

      genReqId: () => {
        return crypto.randomUUID();
      },
    });
  }

  async start(): Promise<void> {
    this.setupHooks();
    this.setupErrorHandler();
    this.setupNotFoundHandler();
    await this.setupMiddlewares();

    await this.setupRoutes();

    try {
      await this.fastify.listen({ port: this.config.port });
    } catch (err) {
      this.fastify.log.error(err);

      throw err;
    }
  }

  private async setupRoutes(): Promise<void> {
    await this.fastify.register(
      async (fastify) => {
        for (const registrar of this.config.routes) {
          await registrar.registerRoutes(fastify);
        }
      },
      { prefix: '/api' }
    );
  }

  private setupHooks(): void {
    // this.fastify.addHook('onRequest', async (request) => {
    //   this.fastify.log.info(
    //     { requestId: request.id },
    //     `Received request: ${request.method} ${request.url}`
    //   );
    // });
    // this.fastify.addHook('onResponse', async (request) => {
    //   this.fastify.log.info(
    //     { requestId: request.id },
    //     `Responded to request: ${request.method} ${request.url}`
    //   );
    // });
  }

  private setupErrorHandler(): void {
    this.fastify.setErrorHandler(async (error, request, reply) => {
      return await errorHandler(error, request, reply);
    });
  }

  private setupNotFoundHandler(): void {
    this.fastify.setNotFoundHandler(async (request, reply) => {
      this.fastify.log.warn(`Not Found: ${request.method} ${request.url}`);

      return await reply.status(404).send({
        error: 'Not Found',
        message: 'The requested resource could not be found.',
      });
    });
  }

  private async setupMiddlewares(): Promise<void> {
    await this.fastify.register(express);
    this.fastify.use(require('cors')());
    this.fastify.use(require('helmet')());
  }

  async stop(): Promise<void> {
    try {
      await this.fastify.close();

      this.fastify.log.info('Server stopped successfully');
    } catch (err) {
      this.fastify.log.error('Error stopping server:', err);
      throw err;
    }
  }

  getInstance(): FastifyInstance {
    return this.fastify;
  }
}
