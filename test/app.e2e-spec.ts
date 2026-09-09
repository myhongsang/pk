import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/products (GET) without token returns 403', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(403);
  });

  it('/products (GET) with invalid token returns 403', () => {
    return request(app.getHttpServer())
      .get('/products')
      .set('Authorization', 'Bearer invalid.token.value')
      .expect(403);
  });

  afterEach(async () => {
    await app.close();
  });
});
