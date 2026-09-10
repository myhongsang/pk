import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@app/app.module';

describe('Products API auth flow (e2e)', () => {
  let app: INestApplication<App>;
  const email = `repro_${Date.now()}@test.com`;
  const password = 'secret123';
  const name = 'Repro User';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a user, logs in, accesses /products with the token', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/users')
      .send({ name, email, password })
      .expect([200, 201]);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect([200, 201]);

    const token = loginRes.body.accessToken;
    expect(token).toBeDefined();

    const productsRes = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(productsRes.body)).toBe(true);
  });
});
