import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authConstants } from '../auth/constants';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ email });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ id });
  }

  async create(createUserDTO: CreateUserDto): Promise<User> {
    createUserDTO.password = await bcrypt.hash(
      createUserDTO.password,
      authConstants.saltRounds,
    );
    const user = this.usersRepository.create(createUserDTO);
    return this.usersRepository.save(user);
  }
}
