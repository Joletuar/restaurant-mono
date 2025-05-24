export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,

  INTERNAL_SERVER_ERROR = 500,
}

export interface ApiErrorDetails {
  message: string;
}

export interface ApiErrorResponse {
  error: {
    statusCode: HttpStatusCode;
    code: string;
    requestId: string;
    message: string;
    details: ApiErrorDetails[];
    timestamp: string;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  meta: {
    timestamp: string;
  };
}

export interface ApiPaginatedResponse<T = unknown> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
  };
}

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiPaginatedResponse<T>
  | ApiErrorResponse;
