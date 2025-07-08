import type { FastifyReply, FastifyRequest } from 'fastify';

import { ResponseBuilder } from '../utils/response.builder';

export class HealthCheckController {
  async execute(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    return await ResponseBuilder.success({ reply, data: 'pong' });
  }
}
