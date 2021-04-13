import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, Subscriber } from 'rxjs';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertiesService } from './properties.service';
import { Property } from './interfaces/property.interface';

@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all properties';
  }

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto): Property {
    const isNumber = typeof createPropertyDto.nbLots === 'number';
    return this.propertiesService.create(createPropertyDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<any> {
    return new Observable((observer: Subscriber<{ foo: number }>) => {
      observer.next({
        foo: id,
      });
      observer.complete();
    });
  }

  @Delete()
  delete() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'You are not authorized to delete a property',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
