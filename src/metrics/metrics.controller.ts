import { Controller, Get } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';

@Controller('metrics')
export class MetricsController {
  constructor(private prometheusService: PrometheusService) {}
  @Get()
  getMetrics() {
    return this.prometheusService.getMetrics();
  }
}
