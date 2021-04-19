import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from './constants';
import { UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { repositoryMockFactory } from '../test-utils';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: authConstants.jwtSecret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('login should return access_token', async () => {
    await expect(authService.login(getValidUser())).resolves.toHaveProperty(
      'access_token',
    );
  });

  describe('validateUser should throw unauthorized exception', () => {
    it('when user is not known', async () => {
      await expect(
        authService.validateUser('jest@facebook.com', 'Welcome-1234!'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('when user password is not matching', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(getValidUser());
      await expect(
        authService.validateUser('jest@facebook.com', 'Welcome-1234!'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

function getValidUser(): User {
  return {
    id: uuidv4(),
    username: 'jest',
    email: 'jest@facebook.com',
    password: 'somehashedpassword',
    isActive: true,
    properties: [],
  };
}
