import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const message = {
      path: req.path,
      headers: req.headers,
      params: req.params,
      body: req.body,
    };
    this.logger.log(message);
    next();
  }
}
