import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../users/user.model';
import { JwtService } from '@nestjs/jwt';

//This should be a global variable
const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserModel> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        const obfuscatedUser = { ...user, password: 'CannotDisplayPassword' };
        return obfuscatedUser;
      }
      throw new UnauthorizedException(
        'Password not matching for user ' + username,
      );
    } else {
      throw new BadRequestException('Cannot find user ' + username);
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
