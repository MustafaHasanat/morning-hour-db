/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class CustomBadRequestFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException && exception.getStatus() === 400) {
      const errorMessage = 'Bad Request: The request payload is invalid.';
      response.status(400).json({
        message: errorMessage,
        error: 'Bad Request',
        statusCode: 400,
        details: {
          validationErrors: exception.getResponse(),
        },
      });
    } else {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }
}
