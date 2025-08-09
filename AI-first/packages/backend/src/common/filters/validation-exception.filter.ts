import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const defaultStatus = 400;
    const exceptionResponse = exception.getResponse() as
      | string
      | {
          message?: string | string[];
          error?: string;
          statusCode?: number;
          [key: string]: unknown;
        };

    const messages = Array.isArray((exceptionResponse as any)?.message)
      ? ((exceptionResponse as any).message as string[])
      : [
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any)?.message ?? 'Validation failed',
        ];

    response.status(defaultStatus).json({
      statusCode: defaultStatus,
      error: 'Bad Request',
      message: messages,
    });
  }
}


