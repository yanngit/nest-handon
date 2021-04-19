import {
  Injectable,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { LoggerMiddleware } from './logger.middleware';
import { PropertiesController } from './properties/properties.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { APP_PIPE } from '@nestjs/core';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB_NAME,
      autoLoadEntities: true,
      entities: [],
      //Setup this to false in production, or data loss can occur
      synchronize: true,
    };
  }
}

@Module({
  imports: [
    PropertiesModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmConfigService],
      useClass: TypeOrmConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(PropertiesController, UsersController);
  }
}
