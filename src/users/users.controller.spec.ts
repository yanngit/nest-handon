import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { repositoryMockFactory } from '../../test/util';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should catch error and return bad request if user already existing', async () => {
      const createUserDto = getValidCreateUserDto();
      const err = {
        code: 'ER_DUP_ENTRY',
      };
      //jest.spyOn(service, 'create').mockImplementation(() => asyncMock);
      jest.spyOn(usersService, 'create').mockRejectedValue(err);

      //await expect(controller.create(req)).rejects.toThrow(BadRequestException);
      await expect(usersController.create(createUserDto)).rejects.toThrowError(
        'A user with this email is already existing',
      );
    });
  });
});

function getValidCreateUserDto(): CreateUserDto {
  return new CreateUserDto('jest@facebook.com', 'jest', 'Welcome');
}
