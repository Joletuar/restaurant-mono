import { FastifyReply, FastifyRequest } from 'fastify';

import { ResponseBuilder } from '../utils/response.builder';
import { Controller } from './controller.interface';

export class HealthCheckController implements Controller {
  async execute(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    return await ResponseBuilder.success({ reply, data: 'pong' });
  }
}
