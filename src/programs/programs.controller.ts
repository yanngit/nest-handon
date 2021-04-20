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
import { CreateProgramDto } from './dto/create-program.dto';
import { ProgramsService } from './programs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { Program } from './program.entity';

@Controller('properties')
@UseGuards(JwtAuthGuard)
export class ProgramsController {
  constructor(private programsService: ProgramsService) {}
  @Get()
  async findAll(@Req() request: Request): Promise<CreateProgramDto[]> {
    return this.programsService.findAll(request.user as User);
  }

  /*Used to serialized returned objects.
   * With this, the @Exclude in the entity is taken into account for serialisation*/
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @Req() request: Request,
    @Body() createPropertyDto: CreateProgramDto,
  ): Promise<Program> {
    return this.programsService.create(request.user as User, createPropertyDto);
  }

  @Get(':id')
  findOne(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Program | undefined> {
    return this.programsService.findOne(request.user as User, id);
  }

  @Delete()
  delete() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'You are not authorized to delete a program',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
