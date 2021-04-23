import { Injectable } from '@nestjs/common';

class PathStats {
  private readonly path: string;
  private nbCallTotal = 0;
  private nbCallByStatus = new Map<number, number>();

  constructor(path: string) {
    this.path = path;
  }
  public incrementNbCallByStatus(status: number): void {
    this.nbCallTotal += 1;
    const res = this.nbCallByStatus.get(status);
    if (res === undefined) {
      this.nbCallByStatus.set(status, 1);
    } else {
      this.nbCallByStatus.set(status, res + 1);
    }
  }

  public serialize(): string {
    let res =
      'nest_http_requests_total {route="' +
      this.path +
      '"} ' +
      this.nbCallTotal +
      '\n';

    this.nbCallByStatus.forEach((count, status) => {
      res +=
        'nest_http_requests_total {route="' +
        this.path +
        '", status="' +
        status +
        '"} ' +
        count +
        '\n';
    });

    return res;
  }
}
@Injectable()
export class PrometheusService {
  private routes = new Map<string, PathStats>();

  //add method type
  public routeCall(path: string, status: number): void {
    const pathStats = this.verifyPathExists(path);
    pathStats.incrementNbCallByStatus(status);
  }

  private verifyPathExists(path: string): PathStats {
    let res = this.routes.get(path);
    if (res === undefined) {
      res = new PathStats(path);
      this.routes.set(path, res);
    }
    return res;
  }

  getMetrics() {
    let res =
      '# HELP nest_http_requests_total Number of http request for the route label.\n' +
      '# TYPE nest_http_requests_total counter \n';
    this.routes.forEach((pathStats) => {
      res += pathStats.serialize();
    });
    return res;
  }
}
