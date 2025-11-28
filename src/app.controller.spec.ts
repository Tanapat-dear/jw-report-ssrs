import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; 
import { AppModule } from '../src/app.module';

describe('APP Controller Performance', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should respond within 50ms', async () => {
    const start = performance.now();
    await request(app.getHttpServer()).get('/master');
    const end = performance.now();
 
    expect(end - start).toBeLessThan(50); // threshold
  });
});
