import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesController } from './properties/properties.controller';

@Module({
  imports: [],
  controllers: [AppController, PropertiesController],
  providers: [AppService],
})
export class AppModule {}
