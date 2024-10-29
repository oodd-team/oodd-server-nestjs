import {
  NOT_FOUND_DATA,
  ErrorCode,
  INVALID_INPUT_VALUE,
  UNAUTHORIZED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
} from './error';

export const DataNotFoundException = (message?: string): ServiceException => {
  return new ServiceException(NOT_FOUND_DATA, message);
};

export const InvalidInputValueException = (
  message?: string,
): ServiceException => {
  return new ServiceException(INVALID_INPUT_VALUE, message);
};

export const UnauthorizedException = (message?: string): ServiceException => {
  return new ServiceException(UNAUTHORIZED, message);
};

export const ForbiddenException = (message?: string): ServiceException => {
  return new ServiceException(FORBIDDEN, message);
};

export const InternalServerException = (message?: string): ServiceException => {
  return new ServiceException(INTERNAL_SERVER_ERROR, message);
};


export class ServiceException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    if (!message) {
      message = errorCode.message;
    }

    super(message);

    this.errorCode = errorCode;
  }
}
