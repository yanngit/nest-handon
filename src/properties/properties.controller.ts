import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Observable, Subscriber } from 'rxjs';
import { CreatePropertyDto } from "./create-property.dto";

@Controller('properties')
export class PropertiesController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all properties';
  }
  @Post()
  create(@Body() createCatDto: CreatePropertyDto): string {
    return 'This action adds the following property : ' + createCatDto.name;
  }
  @Get(':id')
  findOne(@Param() params): Observable<any> {
    return new Observable((observer: Subscriber<{ foo: string }>) => {
      observer.next({
        foo: params.id,
      });
      observer.complete();
    });
  }
}
