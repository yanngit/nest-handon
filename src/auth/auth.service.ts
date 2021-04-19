import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        const obfuscatedUser = { ...user, password: 'CannotDisplayPassword' };
        return obfuscatedUser;
      }
      throw new UnauthorizedException(
        'Password not matching for user ' + email,
      );
    } else {
      throw new UnauthorizedException('Cannot find user ' + email);
    }
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
    };
  }
}
