import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, Subscriber } from 'rxjs';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { Property } from './property.entity';

@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}
  @Get()
  async findAll(@Req() request: Request): Promise<CreatePropertyDto[]> {
    return this.propertiesService.findAll(request.user as User);
  }

  /*Used to serialized returned objects.
   * With this, the @Exclude in the entity is taken into account for serialisation*/
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @Req() request: Request,
    @Body() createPropertyDto: CreatePropertyDto,
  ): Promise<Property> {
    return this.propertiesService.create(
      request.user as User,
      createPropertyDto,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Property | undefined> {
    return this.propertiesService.findOne(request.user as User, id);
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
