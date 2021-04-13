import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserModel } from './user.model';

//This should be a global variable
const saltRounds = 10;

@Injectable()
export class UsersService {
  private users: UserModel[] = [];

  constructor() {
    this.createUser('john', 'changeme');
    this.createUser('annie', 'hello');
  }
  async findOne(username: string): Promise<UserModel | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async createUser(username: string, password: string): Promise<UserModel> {
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser: UserModel = {
      userId: this.users.length,
      username: username,
      password: hash,
    };
    this.users.push(newUser);
    return newUser;
  }

  private generateHash(plainText: string): string {
    return bcrypt.hashSync(plainText, saltRounds);
  }
}
