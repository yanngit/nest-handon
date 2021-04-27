import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    if (req.path === '/metrics') {
      return next.handle();
    }

    const message = {
      type: 'request',
      path: req.path,
      date: new Date().toISOString(),
      headers: req.headers,
      params: req.params,
      body: req.body,
    };

    if (req.user !== undefined) {
      message['user'] = req.user.email;
    }

    this.logger.log(message);

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const httpContext = context.switchToHttp();
        const res = httpContext.getResponse();
        const message = {
          type: 'response',
          path: req.path,
          user: req.user.email,
          statusCode: res.statusCode,
          processTime: Date.now() - now,
        };

        if (message.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
          message['error'] = res.message;
        }
        this.logger.log(message);
      }),
    );
  }
}
