import { FastifyReply } from 'fastify';

import {
  ApiErrorDetails,
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
  HttpStatusCode,
} from '../contracts/api-contracts';

export class ResponseBuilder {
  static async success<T>({
    reply,
    data,
    meta,
    statusCode = HttpStatusCode.OK,
  }: {
    reply: FastifyReply;
    data: T;
    statusCode?: HttpStatusCode;
    meta?: Omit<ApiPaginatedResponse<T>['meta'], 'timestamp'>;
  }): Promise<FastifyReply> {
    const response: ApiSuccessResponse<T> = {
      data,
      meta: {
        ...meta,
        timestamp: new Date().toISOString(),
      },
    };

    return await reply.status(statusCode).send(response);
  }

  static async successNoContent({
    reply,
    statusCode = HttpStatusCode.NO_CONTENT,
  }: {
    reply: FastifyReply;
    statusCode?: HttpStatusCode;
  }): Promise<FastifyReply> {
    return await reply.status(statusCode).send();
  }

  static async error({
    reply,
    code,
    requestId,
    statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    message,
    details = [],
  }: {
    reply: FastifyReply;
    statusCode?: HttpStatusCode;
    code: string;
    requestId: string;
    message: string;
    details: ApiErrorDetails[];
  }): Promise<FastifyReply> {
    const response: ApiErrorResponse = {
      error: {
        code,
        message,
        statusCode,
        details,
        timestamp: new Date().toISOString(),
        requestId,
      },
    };

    return await reply.status(statusCode).send(response);
  }
}
