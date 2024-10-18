import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ServiceException } from '../exception/service.exception';
import { Response } from 'express';

@Catch(ServiceException)
export class ServiceExceptionToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.errorCode.status;
    const code = exception.errorCode.code;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      code: code,
    });
  }
}
