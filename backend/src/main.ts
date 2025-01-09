import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import * as express from 'express';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static assets from the 'public/uploads' directory
  const uploadFolderPath = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(uploadFolderPath));

  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "sessionId"],
    credentials: true,
  });

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
