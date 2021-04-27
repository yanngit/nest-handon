import * as promClient from 'prom-client';
import { Counter } from 'prom-client';

export class MetricsService {
  private prefix = 'nest_';
  private globalHttpCounter: Counter<any>;
  private errorHttpCounter: Counter<any>;

  constructor() {
    promClient.register.clear();
    promClient.collectDefaultMetrics({
      //prefix: this.prefix,
    });
    this.globalHttpCounter = this.registerCounter(
      'http_requests_endpoint_total',
      'Number of http requests for a particular endpoint',
      ['method', 'endpoint'],
    );
    this.errorHttpCounter = this.registerCounter(
      'http_requests_endpoint_errors_total',
      'Number of http request errors for a particular endpoint',
      ['method', 'endpoint'],
    );
  }

  public increaseGlobalHttpCounter(request: Request): void {
    const { method, endpoint } = this.parseLabels(request);
    this.globalHttpCounter.inc({ method, endpoint }, 1);
  }

  public increaseErrorHttpCounter(request: Request): void {
    const { method, endpoint } = this.parseLabels(request);
    this.errorHttpCounter.inc({ method, endpoint }, 1);
  }

  private parseLabels(request: Request): { method: string; endpoint: string } {
    const method = request.method;
    let endpoint = request.url;

    /*Remove ID of the deleted resource for metrics*/
    if (method === 'DELETE') {
      endpoint = endpoint.substring(0, endpoint.lastIndexOf('/'));
    }
    return { method, endpoint };
  }

  private registerCounter(
    name: string,
    help: string,
    labelNames: string[],
  ): Counter<any> {
    const counter = new promClient.Counter({
      name: this.prefix + name,
      help,
      labelNames,
    });
    return counter;
  }

  public metrics(): Promise<string> {
    return promClient.register.metrics();
  }
}
