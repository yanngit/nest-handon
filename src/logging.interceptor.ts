import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /* constructor(
    @Inject('winston')
    private readonly logger: Logger,
  ) {}*/
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const message = {
      type: 'request',
      path: req.path,
      user: req.user.email,
      date: new Date().toISOString(),
      headers: req.headers,
      params: req.params,
      body: req.body,
    };
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
          date: new Date().toISOString(),
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
