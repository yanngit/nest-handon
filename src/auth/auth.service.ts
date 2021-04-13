import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../users/user.model';

//This should be a global variable
const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<UserModel> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        return user;
      }
      throw new UnauthorizedException(
        'Password not matching for user ' + username,
      );
    } else {
      throw new BadRequestException('Cannot find user ' + username);
    }
  }
}
