import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status;
    let res;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      res = exception.getResponse();
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      res = {
        message: exception.message,
      };
    }

    res['path'] = request.url;
    res['params'] = request.params;
    res['body'] = request.body;

    this.logger.error(res);

    response.status(status).json(res);
  }
}
