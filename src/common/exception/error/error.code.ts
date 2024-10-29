class ErrorCodeVo {
  readonly status: number;
  readonly message: string;
  readonly code: string;

  constructor(status, message, code) {
    this.status = status;
    this.message = message;
    this.code = code;
  }
}

export type ErrorCode = ErrorCodeVo;

// Create an error code instance below.
export const NOT_FOUND_DATA = new ErrorCodeVo(
  404,
  'Entity Not Found',
  'ENTITY_NOT_FOUND',
);

export const INVALID_INPUT_VALUE = new ErrorCodeVo(
  400,
  'Invalid Input Value',
  'INVALID_INPUT_VALUE',
);

export const UNAUTHORIZED = new ErrorCodeVo(
  401,
  'Unauthorized',
  'UNAUTHORIZED',
);

export const FORBIDDEN = new ErrorCodeVo(
  403, 'Forbidden', 
  'FORBIDDEN'
);

export const INTERNAL_SERVER_ERROR = new ErrorCodeVo(
  500,
  'Internal Server Error',
  'INTERNAL_SERVER_ERROR',
);

