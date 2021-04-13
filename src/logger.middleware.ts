import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request headers :' + JSON.stringify(req.headers));
    console.log('Request params :' + JSON.stringify(req.params));
    console.log('Request body :' + JSON.stringify(req.body));
    next();
  }
}
