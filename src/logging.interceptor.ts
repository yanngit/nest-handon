import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
          statusCode: res.statusCode,
          processTime: Date.now() - now,
        };
        this.logger.log(message);
      }),
    );
  }
}
