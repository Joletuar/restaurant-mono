export enum HttpStatusCode {
  OK = 200, // e.g., when the request has succeeded
  CREATED = 201, // e.g., when a new resource has been successfully created
  NO_CONTENT = 204, // e.g., when the request has succeeded but there is no content to return

  BAD_REQUEST = 400, // e.g., when the request is malformed or missing required parameters
  UNAUTHORIZED = 401, // e.g., when authentication is required or has failed
  FORBIDDEN = 403, // e.g., when the user does not have permission to access the resource
  NOT_FOUND = 404, // e.g., when the requested resource does not exist
  CONFLICT = 409, // e.g., when trying to create a resource that already exists
  UNPROCESSABLE_ENTITY = 422, // e.g., when the request is well-formed but semantically incorrect

  INTERNAL_SERVER_ERROR = 500, // e.g., when an unexpected error occurs on the server
  SERVICE_UNAVAILABLE = 503, // e.g., when the server is temporarily unable to handle the request
  GATEWAY_TIMEOUT = 504, // e.g., when the server is acting as a gateway and cannot get a response in time
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
