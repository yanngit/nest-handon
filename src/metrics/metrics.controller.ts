import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private prometheusService: MetricsService) {}
  @Get()
  getMetrics() {
    return this.prometheusService.metrics();
  }
}
