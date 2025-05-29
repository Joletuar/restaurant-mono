import type { FastifyInstance } from 'fastify';

export interface RouteRegistrar {
  registerRoutes(server: FastifyInstance): Promise<void>;
}
