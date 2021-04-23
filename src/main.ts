import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as process from 'process';
import { LoggingInterceptor } from './logging.interceptor';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

const transport = new winston.transports.DailyRotateFile({
  filename: 'nest-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: process.env.LOGGER_MAX_SIZE,
  maxFiles: process.env.LOGGER_MAX_DAYS,
});

function setupLoggerTransports(): any[] {
  const loggerTransports = [];
  loggerTransports.push(transport);
  if (process.env.LOGGER_ENABLE_CONSOLE_OUTPUT === 'true') {
    loggerTransports.push(new winston.transports.Console());
  }
  return loggerTransports;
}

async function bootstrap() {
  const loggerTransports = setupLoggerTransports();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: loggerTransports,
    }),
  });
  app.enableCors();
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.APP_PORT);
}
bootstrap();
