import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule, TypeOrmConfigService } from './../src/app.module';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';

class MockTypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'sqlite' as any,
      database: ':memory:',
      synchronize: true,
      dropSchema: true,
      keepConnectionAlive: true,
      autoLoadEntities: true,
      entities: [],
    };
  }
}
const mockTypeOrmConfigService = new MockTypeOrmConfigService();

const LOGIN_ROUTE = '/auth/login';
const USERS_ROUTE = '/users';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeOrmConfigService)
      .useValue(mockTypeOrmConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // Fetch all the entities
    const entities = getConnection().entityMetadatas;

    for (const entity of entities) {
      const repository = await getConnection().getRepository(entity.name); // Get repository
      await repository.clear(); // Clear each entity table's content
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('create user ', () => {
    it(`with incorrect username/email/password should raise unauthorized`, async () => {
      const inputTab = [
        {
          email: 'e2eUsername@email.com',
          username: 'e2eUsername',
        },
        { username: 'e2eUsername', password: 'e2eUsername@email.com' },
        { email: 'e2eUsername', password: 'e2eUsername@email.com' },
        {
          email: 'e2eUsername@email.com',
          password: 'e2e',
          username: 'e2eUsername',
        },
        {
          email: 'e2eUsername@email.com',
          password: 'e2ePassword',
          username: '',
        },
      ];
      for (const input of inputTab) {
        const resEmail = await request(app.getHttpServer())
          .post(USERS_ROUTE)
          .send(input);
        expect(resEmail.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it(`with correct email/password should be ok`, async () => {
      const resEmail = await request(app.getHttpServer())
        .post(USERS_ROUTE)
        .send({
          username: 'e2eUsername',
          email: 'e2eUsername@email.com',
          password: 'e2ePassword',
        });
      expect(resEmail.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('authenticate user ', () => {
    it(`with missing password or email should raise unauthorized`, async () => {
      const resEmail = await request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          email: 'e2eUsername@email.com',
        });
      expect(resEmail.status).toBe(HttpStatus.UNAUTHORIZED);
      const resPassword = await request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          password: 'e2ePassword',
        });
      expect(resPassword.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`with not existing email/password should raise unauthorized`, async () => {
      const res = await request(app.getHttpServer()).post(LOGIN_ROUTE).send({
        email: 'e2eUsername@email.com',
        password: 'e2ePassword',
      });
      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    describe('with existing user ', () => {
      beforeAll(async () => {
        const user = await request(app.getHttpServer()).post('/users').send({
          username: 'e2eUsername',
          email: 'e2eUsername@email.com',
          password: 'e2ePassword',
        });
        expect(user.status).toBe(HttpStatus.CREATED);
      });

      it(`and correct credentials should be ok`, async () => {
        const res = await request(app.getHttpServer()).post(LOGIN_ROUTE).send({
          email: 'e2eUsername@email.com',
          password: 'e2ePassword',
        });
        expect(res.status).toBe(HttpStatus.CREATED);
      });

      it(`and wrong credentials should raise unauthorized`, async () => {
        const res = await request(app.getHttpServer()).post(LOGIN_ROUTE).send({
          email: 'e2eUsername@email.com',
          password: 'e2ePasswordWrong',
        });
        expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      });

      /*afterAll(async () => {
        const user = await request(app.getHttpServer()).delete('/users').send({
          username: 'e2eUsername',
          email: 'e2eUsername@email.com',
          password: 'e2ePassword',
        });
        expect(user.status).toBe(HttpStatus.CREATED);
      });
    });*/
    });

    afterAll(async () => {
      await app.close();
    });
  });
});
