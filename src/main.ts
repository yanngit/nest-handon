import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { LoggerConfigurator } from './logger-configurator';

async function bootstrap() {
  const loggerConfigurator = new LoggerConfigurator();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: loggerConfigurator.getWinstonLoggers(),
  });
  app.enableCors();
  await app.listen(process.env.APP_PORT);
}
bootstrap();
