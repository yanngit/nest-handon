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
    const hash = await bcrypt.hash(password, saltRounds);
    const user = this.usersRepository.create({
      email,
      username,
      password: hash,
    });
    return this.usersRepository.save(user);
  }

  private generateHash(plainText: string): string {
    return bcrypt.hashSync(plainText, saltRounds);
  }
}
