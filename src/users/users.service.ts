import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//This should be a global variable
const saltRounds = 10;

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    /*this.createUser('john', 'changeme');
    this.createUser('annie', 'hello');*/
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne(username);
  }

  async createUser(username: string, password: string): Promise<User> {
    const hash = await bcrypt.hash(password, saltRounds);
    const user = this.usersRepository.create({
      username: username,
      password: hash,
    });
    return this.usersRepository.save(user);
  }

  private generateHash(plainText: string): string {
    return bcrypt.hashSync(plainText, saltRounds);
  }
}
