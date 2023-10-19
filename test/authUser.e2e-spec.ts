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

describe('AuthUserControllers (e2e)', () => {
  const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTBjMzE5YTk0NjFkNTRiYzQ3NTFkMDAiLCJ1c2VyRW1haWwiOiJzbDE2M0BoaC5ydSIsImlhdCI6MTY5NTI5Nzk1NiwiZXhwIjoxNjk1Mjk3OTU5fQ.zttsGwenZIWfZt0VHq5XmGTgR8ktWtq2WUa2h7EKtsc';
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
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

  it('/auth/register (POST) - fail (user already exist)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUserDto)
      .expect(400);
  });

  it('/auth/register (POST) - fail (wrong weight)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...testUserDto, email: 'test@testwrong.ru', weight: 10 })
      .expect(400);
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

  it('/auth/login (POST) - fail (wrong password)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ testUserDto, password: '12345678' })
      .expect(400);
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

  it('/auth/check (GET) - fail (bad token)', () => {
    return request(app.getHttpServer())
      .get('/auth/check')
      .set('Authorization', `Bearer ${token}123`)
      .expect(401);
  });

  it('/user (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => expect(body.email).toBe(testUserDto.email));
  });

  it('/user (GET) - fail (bad token)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}123`)
      .expect(401);
  });

  it('/user (PATCH) - success', async () => {
    const editedNick = 'edited nick';
    return request(app.getHttpServer())
      .patch('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ testUserDto, nick: editedNick })
      .expect(200)
      .then(({ body }) => expect(body.nick).toBe(editedNick));
  });

  it('/user (PATCH) - fail (wrong user token)', () => {
    const editedNick = 'edited nick';
    return request(app.getHttpServer())
      .patch('/user')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ testUserDto, nick: editedNick })
      .expect(401);
  });

  it('/user (PATCH) - fail (email changing)', () => {
    return request(app.getHttpServer())
      .patch('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ testUserDto, email: 'test@edittest.com' })
      .expect(400);
  });

  it('/user (PATCH) - fail (password changing)', () => {
    return request(app.getHttpServer())
      .patch('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ testUserDto, password: 'new123new' })
      .expect(400);
  });

  it('/user (PATCH) - fail (shoeList changing)', () => {
    return request(app.getHttpServer())
      .patch('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ testUserDto, shoeList: [] })
      .expect(400);
  });

  it('/user (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(testUserDto.email);
      });
  });

  it('/user (DELETE) - fail (user does not exist)', () => {
    return request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  afterAll(() => {
    disconnect();
  });
});
