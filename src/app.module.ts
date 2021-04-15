import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { LoggerMiddleware } from './logger.middleware';
import { PropertiesController } from './properties/properties.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PropertiesModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      entities: [],
      /*Setup this to false in production, or data loss can occur*/
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(PropertiesController);
  }
}
