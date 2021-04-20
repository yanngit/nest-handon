import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './program.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private programRepository: Repository<Program>,
  ) {}

  async create(
    user: User,
    createProgramDto: CreateProgramDto,
  ): Promise<Program> {
    const property = this.programRepository.create(createProgramDto);
    property.user = user;
    return this.programRepository.save(property);
  }

  async findAll(user: User): Promise<Program[]> {
    return this.programRepository.find({ user: user });
  }

  async findOne(user: User, id: number): Promise<Program | undefined> {
    return this.programRepository.findOne({ user: user, id: id });
  }
}
