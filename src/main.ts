import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV !== 'production',
  });
  /*app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );*/
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  await app.listen(process.env.APP_PORT);
}
bootstrap();
