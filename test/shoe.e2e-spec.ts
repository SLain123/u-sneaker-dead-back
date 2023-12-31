import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect } from 'mongoose';

import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/auth.dto';
import { ShoeDto } from '../src/shoe/shoe.dto';

const testUserDto: AuthDto = {
  email: 'supertest@run.ru',
  password: '123456',
};

const testShoeDto: ShoeDto = {
  name: 'sneakers-test',
  initDurability: 0,
  totalDurability: 100,
  purchaseDate: new Date('1989-07-20'),
};

const wait = async (time = 1000) =>
  await new Promise((r) => setTimeout(r, time));

describe('AuthController (e2e)', () => {
  const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTBjMzE5YTk0NjFkNTRiYzQ3NTFkMDAiLCJ1c2VyRW1haWwiOiJzbDE2M0BoaC5ydSIsImlhdCI6MTY5NTI5Nzk1NiwiZXhwIjoxNjk1Mjk3OTU5fQ.zttsGwenZIWfZt0VHq5XmGTgR8ktWtq2WUa2h7EKtsc';
  const fakeShoeId = '6512d01295d02ddd8f79101f';
  let app: INestApplication;
  let token: string;
  let shoeId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUserDto)
      .then(({ body }) => {
        token = body.access_token;
      });
  });

  it('/shoe/create (POST) - success', async () => {
    await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => expect(body.shoeList).toHaveLength(0));

    await request(app.getHttpServer())
      .post('/shoe/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testShoeDto)
      .expect(201)
      .then(({ body }) => {
        expect(body._id).toBeDefined();
        shoeId = body._id;
      });

    await wait(3000);
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => expect(body.shoeList).toHaveLength(1));
  });

  it('/shoe/create (POST) - fail (wrong purchase date)', () => {
    return request(app.getHttpServer())
      .post('/shoe/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testShoeDto, purchaseDate: new Date('1900-13-13') })
      .expect(400);
  });

  it('/shoe (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/shoe/all?page=1&size=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => expect(body).toHaveLength(1));
  });

  it('/shoe (GET) - success (only unactive shoe)', async () => {
    return request(app.getHttpServer())
      .get('/shoe/all?active=false&page=1&size=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => expect(body).toHaveLength(0));
  });

  it('/shoe (PATCH) - success', async () => {
    const editedName = 'sneakers-test-edited';
    return request(app.getHttpServer())
      .patch(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: editedName })
      .expect(200)
      .then(({ body }) => {
        expect(body.name).toBe(editedName);
      });
  });

  it('Durability chack (change init durability and check recalculated carrent durability)', async () => {
    const editedDurability = 100;
    await request(app.getHttpServer())
      .get(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.currentDurability).toBe(0);
        expect(body.active).toBeTruthy();
      });

    await request(app.getHttpServer())
      .patch(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ initDurability: editedDurability })
      .expect(200);

    return request(app.getHttpServer())
      .get(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.currentDurability).toBe(editedDurability);
        expect(body.active).toBeFalsy();
      });
  });

  it('/shoe (PATCH) - fail (wrong init durability) ', () => {
    return request(app.getHttpServer())
      .patch(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ initDurability: 99999 })
      .expect(400);
  });

  it('/shoe (PATCH) - fail (attempts current durability and active status change)', async () => {
    await request(app.getHttpServer())
      .patch(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ currentDurability: 99 })
      .expect(400);

    return request(app.getHttpServer())
      .patch(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ active: true })
      .expect(400);
  });

  it('/shoe (PATCH) - fail (wrong shoe owner) ', () => {
    return request(app.getHttpServer())
      .patch(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ name: 'new' })
      .expect(401);
  });

  it('/shoe (DELETE) - fail (wrong shoe owner) ', () => {
    return request(app.getHttpServer())
      .delete(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect(401);
  });

  it('/shoe (DELETE) - fail (wrong shoe id) ', () => {
    return request(app.getHttpServer())
      .delete(`/shoe/${fakeShoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/shoe (DELETE) - success', async () => {
    await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => expect(body.shoeList).toHaveLength(1));

    await request(app.getHttpServer())
      .delete(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await wait();
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => expect(body.shoeList).toHaveLength(0));
  });

  afterAll(() => {
    disconnect();
  });
});
