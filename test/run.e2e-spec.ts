import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect } from 'mongoose';

import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/auth.dto';
import { ShoeDto } from '../src/shoe/shoe.dto';
import { RunDto } from '../src/run/run.dto';

const testUserDto: AuthDto = {
  email: 'supertest@run.ru',
  password: '123456',
};

const testShoeDto: ShoeDto = {
  name: 'sneakers-test',
  initDurability: 0,
  totalDurability: 3000,
  purchaseDate: new Date('1989-07-20'),
};

const testRunDto: RunDto = {
  trDate: new Date('1989-07-20'),
  trDistance: 10,
  shoeId: '',
};

const wait = async (time = 1000) =>
  await new Promise((r) => setTimeout(r, time));

describe('AuthController (e2e)', () => {
  const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTBjMzE5YTk0NjFkNTRiYzQ3NTFkMDAiLCJ1c2VyRW1haWwiOiJzbDE2M0BoaC5ydSIsImlhdCI6MTY5NTI5Nzk1NiwiZXhwIjoxNjk1Mjk3OTU5fQ.zttsGwenZIWfZt0VHq5XmGTgR8ktWtq2WUa2h7EKtsc';
  const fakeId = '6512d01295d02ddd8f79101f';
  let app: INestApplication;
  let token: string;
  let shoeId: string;
  let runId: string;
  let secondShoeId: string;

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

    await request(app.getHttpServer())
      .post('/shoe/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testShoeDto)
      .then(({ body }) => {
        shoeId = body._id;
      });
  });

  it('/run/create (POST) - success', async () => {
    await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => expect(body.runList).toHaveLength(0));

    await request(app.getHttpServer())
      .post('/run/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testRunDto, shoeId })
      .expect(201)
      .then(({ body }) => {
        expect(body._id).toBeDefined();
        runId = body._id;
      });

    await wait();
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => expect(body.runList).toHaveLength(1));
  });

  it('Durability check (create extra run and check shoe durability, then change training distance and check durability, then remove extra run and another check)', async () => {
    let extraRunId;
    await request(app.getHttpServer())
      .get(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.currentDurability).toBe(10);
      });

    await request(app.getHttpServer())
      .post('/run/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testRunDto, shoeId })
      .expect(201)
      .then(({ body }) => {
        extraRunId = body._id;
      });

    await request(app.getHttpServer())
      .get(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.currentDurability).toBe(20);
      });

    await request(app.getHttpServer())
      .patch(`/run/${extraRunId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ trDistance: 100 })
      .expect(200);

    await request(app.getHttpServer())
      .get(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.currentDurability).toBe(110);
      });

    await request(app.getHttpServer())
      .delete(`/run/${extraRunId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    return request(app.getHttpServer())
      .get(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.currentDurability).toBe(10);
      });
  });

  it('/run/create (POST) - fail (wrong shoeId)', () => {
    return request(app.getHttpServer())
      .post('/run/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testRunDto, shoeId: fakeId })
      .expect(400);
  });

  it('/run (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/run')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => expect(body).toHaveLength(1));
  });

  it('/run (GET) by id - success', async () => {
    return request(app.getHttpServer())
      .get(`/run/${runId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => expect(body.trDistance).toBe(testRunDto.trDistance));
  });

  it('/run (PATCH) - success (distance change)', async () => {
    const editedDistance = 100;
    return request(app.getHttpServer())
      .patch(`/run/${runId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ trDistance: editedDistance })
      .expect(200)
      .then(({ body }) => {
        expect(body.trDistance).toBe(editedDistance);
      });
  });

  it('/shoe (PATCH) - success (shoe change)', async () => {
    await request(app.getHttpServer())
      .post('/shoe/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testShoeDto)
      .then(({ body }) => {
        secondShoeId = body._id;
      });

    await request(app.getHttpServer())
      .patch(`/run/${runId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ shoeId: secondShoeId })
      .expect(200)
      .then(({ body }) => {
        expect(body.shoe).toBe(secondShoeId);
      });
  });

  it('/run (PATCH) - fail (wrong shoeId)', () => {
    return request(app.getHttpServer())
      .patch(`/run/${runId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ shoeId: fakeId })
      .expect(400);
  });

  it('/shoe (PATCH) - fail (attempts shoe field instead of shoeId)', () => {
    return request(app.getHttpServer())
      .patch(`/run/${runId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ shoe: fakeId })
      .expect(400);
  });

  it('/shoe (PATCH) - fail (wrong run owner)', () => {
    return request(app.getHttpServer())
      .patch(`/run/${runId}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ trDistance: 101 })
      .expect(401);
  });

  it('/shoe (PATCH) - fail (wrong shoe owner)', async () => {
    let differentToken;
    let differentShoeId;

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'supertest@shoe.ru',
        password: '123456',
      })
      .then(({ body }) => {
        differentToken = body.access_token;
      });

    await request(app.getHttpServer())
      .post('/shoe/create')
      .set('Authorization', `Bearer ${differentToken}`)
      .send(testShoeDto)
      .then(({ body }) => {
        differentShoeId = body._id;
      });

    await request(app.getHttpServer())
      .patch(`/run/${runId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ shoeId: differentShoeId })
      .expect(401);

    return request(app.getHttpServer())
      .delete(`/shoe/${differentShoeId}`)
      .set('Authorization', `Bearer ${differentToken}`);
  });

  it('/shoe (DELETE) - fail (wrong run owner)', () => {
    return request(app.getHttpServer())
      .delete(`/run/${runId}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect(401);
  });

  it('/shoe (DELETE) - fail (wrong run id)', () => {
    return request(app.getHttpServer())
      .delete(`/shoe/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/run (DELETE) - success', async () => {
    await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => expect(body.runList).toHaveLength(1));

    await request(app.getHttpServer())
      .delete(`/run/${runId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await wait();
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => expect(body.runList).toHaveLength(0));
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/shoe/${shoeId}`)
      .set('Authorization', `Bearer ${token}`);

    await request(app.getHttpServer())
      .delete(`/shoe/${secondShoeId}`)
      .set('Authorization', `Bearer ${token}`);

    disconnect();
  });
});
