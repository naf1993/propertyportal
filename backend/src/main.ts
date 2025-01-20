import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
config(); console.log('Loaded JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

async function bootstrap() { 

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  console.log('Loaded JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY); // Debug log
  app.setGlobalPrefix('api');
  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "sessionId"],
    credentials: true,
  });

  // const propservice = app.get(PropertyService)
  // await propservice.createProperties()

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
