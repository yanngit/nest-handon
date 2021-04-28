import * as process from 'process';
import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

const transport = new winston.transports.DailyRotateFile({
  filename: 'nest-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: process.env.LOGGER_MAX_SIZE,
  maxFiles: process.env.LOGGER_MAX_DAYS,
});

export class LoggerConfigurator {
  public getWinstonLoggers(): LoggerService {
    return WinstonModule.createLogger({
      transports: this.setupLoggerTransports(),
    });
  }

  private setupLoggerTransports(): any[] {
    const loggerTransports = [];
    loggerTransports.push(transport);
    if (process.env.LOGGER_ENABLE_CONSOLE_OUTPUT === 'true') {
      loggerTransports.push(new winston.transports.Console());
    }
    if (process.env.LOGGER_ENABLE_ELASTICSEARCH_OUTPUT === 'true') {
      const client = new Client({
        node:
          'http://' +
          process.env.ELASTICSEARCH_HOST +
          ':' +
          process.env.ELASTICSEARCH_PORT,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
      });
      const esTransportOpts = {
        level: process.env.ELASTICSEARCH_LOG_LEVEL,
        index: process.env.ELASTICSEARCH_INDEX,
        client,
      };
      const esTransport = new ElasticsearchTransport(esTransportOpts);
      /*esTransport.on('warning', (err) => {
        console.error('Warning caught', err);
      });*/
      loggerTransports.push(esTransport);
    }
    return loggerTransports;
  }
}
