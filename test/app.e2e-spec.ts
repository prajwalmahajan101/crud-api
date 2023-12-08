import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthDto } from '@/auth/dto';
import { EditUserDto } from '@/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    prisma = app.get(PrismaService);
    await app.init();
    await app.listen(3333);

    prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '123',
    };
    describe('Sign Up', () => {
      it('Should Throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('Should Throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('Should Throw if Body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('Should Sign-Up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Sign In', () => {
      it('Should Throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('Should Throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('Should Throw if Body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('Should Throw if password is wrong', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: `${dto.password}password`,
          })
          .expectStatus(403);
      });
      it('Should Sign-In', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get Me', () => {
      it('Should Get Logged In User', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
      it('Should Throw When no token is passed', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
      it('Should Throw When wrong token is passed', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withBearerToken('$S{userAt}asgdfsgf')
          .expectStatus(401);
      });
    });
    describe('Edit User', () => {
      const dto: EditUserDto = {
        firstName: 'Prajwal',
      };
      it('Should Throw 400 When no Body is passed', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBearerToken('$S{userAt}')
          .expectStatus(400);
      });
      it('Should Throw 400 When invalid body is passed', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody({ firstName: 1 })
          .withBearerToken('$S{userAt}')
          .expectStatus(400);
      });
      it('Should Throw 401 When no token is passed', () => {
        return pactum.spec().patch('/users').withBody(dto).expectStatus(401);
      });
      it('Should Update User', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName);
      });
    });
  });
  describe('Bookmark', () => {
    describe('Create Bookmark', () => {});
    describe('Get Bookmarks', () => {});
    describe('Get Bookmark by id', () => {});
    describe('Edit Bookmark', () => {});
    describe('Delete Bookmark', () => {});
  });
});
