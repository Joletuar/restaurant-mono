import Fastify, { FastifyInstance } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';

import orderRoutes from './routes/order.route';

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

export class FastifyRestApiServer {
  private fastify: FastifyInstance;
  constructor(
    private readonly port: number = 3000,
    environment: 'production' | 'development' | 'test' = 'development'
  ) {
    this.fastify = Fastify({
      logger: envToLogger[environment] ?? envToLogger.development,
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

    await this.setupRoutes();

    try {
      await this.fastify.listen({ port: this.port });
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }

  private async setupRoutes(): Promise<void> {
    await this.fastify.register(
      async (fastify) => {
        fastify.register(orderRoutes, {
          prefix: '/orders',
        });
      },
      { prefix: '/api' }
    );
  }

  private setupHooks(): void {
    this.fastify.addHook('onRequest', async (request) => {
      this.fastify.log.info(
        `Received request: ${request.method} ${request.url}`
      );
    });

    this.fastify.addHook('onSend', async (request, reply, payload) => {
      reply.header('x-request-id', request.id);

      return payload;
    });

    this.fastify.addHook('onResponse', async (request) => {
      this.fastify.log.info(
        `Responded to request: ${request.method} ${request.url}`
      );
    });
  }

  private setupErrorHandler(): void {
    this.fastify.setErrorHandler((error, request, reply) => {
      this.fastify.log.error(
        error,
        `Error occurred during request: ${request.method} ${request.url}`
      );

      reply.status(500).send({
        error: 'Internal Server Error',
        message: error.message,
      });
    });
  }

  private setupNotFoundHandler(): void {
    this.fastify.setNotFoundHandler((request, reply) => {
      this.fastify.log.warn(`Not Found: ${request.method} ${request.url}`);

      reply.status(404).send({
        error: 'Not Found',
        message: 'The requested resource could not be found.',
      });
    });
  }

  async stop(): Promise<void> {
    try {
      await this.fastify.close();

      this.fastify.log.info('Server stopped successfully');
    } catch (err) {
      this.fastify.log.error('Error stopping server:', err);
    }

    process.exit(0);
  }

  getServer(): FastifyInstance {
    return this.fastify;
  }
}
