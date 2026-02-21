import type { FastifyReply, FastifyRequest } from 'fastify';

import { AppErrorCode } from '@src/bounded-contexts/shared/domain/app-error-code.enum';
import { DomainValidationError } from '@src/bounded-contexts/shared/domain/errors/domain-validation.error';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infrastructure.error';
import { NotFoundError } from '@src/bounded-contexts/shared/domain/errors/not-found.error';
import { InvalidPathParameter } from '@src/bounded-contexts/shared/infrastructure/http/errors/invalida-path-parameter.error';

import { HttpStatusCode } from './contracts/api-contracts';
import { ResponseBuilder } from './utils/response.builder';

export const errorHandler = async (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const requestId = request.id;

  reply.log.error(
    error,
    `Error occurred during request: ${request.method} ${request.url}`
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
      statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
      details: error.errors.map((err) => ({ message: err })),
    });
  }

  if (error instanceof InfrastructureError) {
    const originalError = error.originalError;

    if (originalError instanceof InvalidPathParameter) {
      return ResponseBuilder.error({
        reply,
        requestId,
        code: error.appErrorCode,
        message: originalError.message,
        statusCode: HttpStatusCode.BAD_REQUEST,
        details: [],
      });
    }

    return ResponseBuilder.error({
      reply,
      requestId,
      code: error.appErrorCode,
      message: error.message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      details: error.errors.map((err) => ({ message: err })),
    });
  }

  return ResponseBuilder.error({
    reply,
    requestId,
    code: AppErrorCode.UNEXPECTED_ERROR,
    message: 'An unexpected error occurred',
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    details: [],
  });
};
