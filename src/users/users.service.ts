import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authConstants } from '../auth/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    /*this.createUser('emailJohn@gmail.com', 'john', 'changeme');
    this.createUser('emailAnnie@gmail.com', 'annie', 'hello');*/
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ email });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ id });
  }

  async createUser(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const hash = await bcrypt.hash(password, authConstants.jwtExpirationTime);
    const user = this.usersRepository.create({
      email,
      username,
      password: hash,
    });
    return this.usersRepository.save(user);
  }
}
