import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MetricsService } from './metrics.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    this.metricsService.increaseGlobalHttpCounter(req);
    const requestTime = Date.now();
    return next.handle().pipe(
      tap((next) => {
        const processingTime = Date.now() - requestTime;
        this.metricsService.addProcessingTime(req, processingTime);
      }),
    );
  }
}
