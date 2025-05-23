import Fastify, { FastifyInstance } from 'fastify';

export class ResApiServer {
  constructor(
    private server: FastifyInstance = Fastify({
      logger: true,
    })
  ) {}

  async start() {
    // Start the server
  }

  private async registerRoutes() {}

  async stop() {
    // Stop the server
  }
}
