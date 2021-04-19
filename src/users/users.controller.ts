import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Injectable,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@Injectable()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto).catch((err) => {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'A user with this email is already existing',
        );
      } else {
        throw new BadRequestException(err.code);
      }
    });
  }
}
