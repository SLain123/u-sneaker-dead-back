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

const testFirstShoeDto: ShoeDto = {
  name: 'sneakers-test1',
  initDurability: 0,
  totalDurability: 100,
  purchaseDate: new Date('1989-07-20'),
};

const testSecondShoeDto: ShoeDto = {
  name: 'sneakers-test2',
  initDurability: 0,
  totalDurability: 500,
  purchaseDate: new Date('1989-07-21'),
};

const testRunDto: RunDto = {
  trDate: new Date('1989-07-20'),
  trDistance: 10,
  shoeId: '',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let shoeFirstId: string;
  let shoeSecondId: string;
  const runIdList: string[] = [];

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
      .send(testFirstShoeDto)
      .then(({ body }) => (shoeFirstId = body._id));

    await request(app.getHttpServer())
      .post('/shoe/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testSecondShoeDto)
      .then(({ body }) => (shoeSecondId = body._id));
  }, 10000);

  it('/statistic (GET) - success (inital data after double shoe creating)', async () => {
    await request(app.getHttpServer())
      .get('/statistic')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => {
        expect(body.sumDistance).toBe(0);
        expect(body.shoesLength).toBe(2);
        expect(body.activeShoes).toBe(2);
        expect(body.sumActiveDurability).toBe(600);
      });
  });

  it('/statistic (GET) - success (adds double runs and check statistic data calculating)', async () => {
    await request(app.getHttpServer())
      .post('/run/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testRunDto, shoeId: shoeFirstId })
      .expect(201)
      .then(({ body }) => runIdList.push(body._id));

    await request(app.getHttpServer())
      .post('/run/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testRunDto, trDistance: 5, shoeId: shoeFirstId })
      .expect(201)
      .then(({ body }) => runIdList.push(body._id));

    await request(app.getHttpServer())
      .get('/statistic')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => {
        expect(body.sumDistance).toBe(15);
        expect(body.avgDistance).toBe(7.5);
        expect(body.sumActiveDurability).toBe(585);
      });
  });

  it('/statistic (GET) - success (adds huge run and check statistic data calculating for sneakers)', async () => {
    await request(app.getHttpServer())
      .delete(`/shoe/${shoeSecondId}`)
      .set('Authorization', `Bearer ${token}`);

    await request(app.getHttpServer())
      .post('/run/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testRunDto, trDistance: 85, shoeId: shoeFirstId })
      .expect(201)
      .then(({ body }) => runIdList.push(body._id));

    await request(app.getHttpServer())
      .get('/statistic')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => {
        expect(body.sumDistance).toBe(100);
        expect(+body.avgDistance.toFixed(2)).toBe(33.33);
        expect(body.sumActiveDurability).toBe(0);
        expect(body.shoesLength).toBe(1);
        expect(body.activeShoes).toBe(0);
      });
  });

  afterAll(async () => {
    for (const runId of runIdList) {
      await request(app.getHttpServer())
        .delete(`/run/${runId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    }

    await request(app.getHttpServer())
      .delete(`/shoe/${shoeFirstId}`)
      .set('Authorization', `Bearer ${token}`);

    disconnect();
  });
});
