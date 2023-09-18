import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect } from 'mongoose';

import { AppModule } from '../src/app.module';
import { UserDto } from '../src/user/user.dto';

const testUserDto: UserDto = {
  email: 'test@test.ru',
  password: '123456',
  weight: 40,
  nick: 'User',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUserDto)
      .expect(201);
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(testUserDto)
      .expect(200)
      .then(({ body }) => {
        expect(body.access_token).toBeDefined();
        token = body.access_token;
      });
  });

  it('/auth/check (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/auth/check')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.userEmail).toEqual(testUserDto.email);
      });
  });

  it('/auth/user/remove (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/auth/user/remove')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.email).toEqual(testUserDto.email);
      });
  });

  afterAll(() => {
    disconnect();
  });
});
