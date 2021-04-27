import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';
import { MetricsService } from './metrics/metrics.service';

@Catch()
@Injectable()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  constructor(private metricsService: MetricsService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status;
    let res;
    let stack;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      res = exception.getResponse();
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      res = {
        message: exception.message,
      };
      stack = exception.stack;
    }

    res['path'] = request.path;
    res['params'] = request.params;
    res['body'] = request.body;

    this.logger.error(res, stack);
    this.metricsService.increaseErrorHttpCounter(request);
    response.status(status).json(res);
  }
}
