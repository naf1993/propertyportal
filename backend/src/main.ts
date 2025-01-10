import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { join } from 'path';

async function bootstrap() {
  // Load environment variables from the .env file in the project root
  dotenv.config({ path: join(__dirname, '../../.env') });

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
