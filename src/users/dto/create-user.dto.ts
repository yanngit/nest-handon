import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @IsEmail()
  email: string;
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$/, {
    message: 'Password too weak, it must be alphanumeric',
  })
  password: string;
}
