import type { FastifyReply, FastifyRequest } from 'fastify';

import { AppErrorCode } from '@src/bounded-contexts/shared/domain/app-error-code.enum';
import { DomainValidationError } from '@src/bounded-contexts/shared/domain/errors/domain-validation.error';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infraestructure.error';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
import { RootError } from '@src/bounded-contexts/shared/domain/errors/root.error';

import { HttpStatusCode } from './contracts/api-contracts';
import { ResponseBuilder } from './utils/response.builder';

export const errorHandler = async (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const requestId = request.id;

  if (error instanceof RootError) {
    reply.log.error(
      error,
      `Expected error occurred during request: ${request.method} ${request.url}`
    );

    if (error instanceof NotFoundError) {
      return ResponseBuilder.error({
        reply,
        requestId,
        message: error.message,
        code: error.appErrorCode,
        details: error.errors.map((err) => ({ message: err })),
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    if (error instanceof DomainValidationError) {
      return ResponseBuilder.error({
        reply,
        requestId,
        code: error.appErrorCode,
        message: error.message,
        statusCode: HttpStatusCode.BAD_REQUEST,
        details: error.errors.map((err) => ({ message: err })),
      });
    }

    if (error instanceof InfrastructureError) {
      return ResponseBuilder.error({
        reply,
        requestId,
        code: error.appErrorCode,
        message: error.message,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        details: error.errors.map((err) => ({ message: err })),
      });
    }
  }

  // Error no manejado

  reply.log.error(
    error,
    `Unexpected error occurred during request: ${request.method} ${request.url}`
  );

  return ResponseBuilder.error({
    reply,
    requestId,
    code: AppErrorCode.UNEXPECTED_ERROR,
    message: 'An unexpected error occurred',
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    details: [],
  });
};
