import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import compress from '@fastify/compress';

async function bootstrap() {
  // สร้าง app ด้วย Fastify adapter
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 20 * 1024 * 1024, // 20MB สำหรับ payload ใหญ่
    }),
  );

  app.enableCors();

  // ใช้ fastify-compress แทน express compression
    await app.register(compress, {
    global: true,
    encodings: ['gzip', 'deflate', 'br'], // gzip, deflate, brotli

    // gzip/deflate options
    zlibOptions: { level: 6 },

    // brotli options must use 'params'
    brotliOptions: {
      params: {
        [require('zlib').constants.BROTLI_PARAM_QUALITY]: 4, // 0-11
      },
    },
  });


  // Swagger
  const config = new DocumentBuilder()
    .setTitle('JW REPORT DATA API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth() // ถ้าใช้ JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
