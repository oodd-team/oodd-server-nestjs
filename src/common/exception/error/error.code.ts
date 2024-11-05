import { ApiProperty } from '@nestjs/swagger';
export class ErrorCodeVo {
  @ApiProperty({ example: 404, description: 'HTTP 상태 코드' })
  readonly status: number;
  @ApiProperty({ example: 'Entity Not Found', description: '오류 메시지' })
  readonly message: string;
  @ApiProperty({ example: 'ENTITY_NOT_FOUND', description: '오류 메시지' })
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

