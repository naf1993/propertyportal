import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import * as express from 'express';
import { properties } from 'data';
import { PropertyService } from './property/property.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static assets from the 'public/uploads' directory
  const uploadFolderPath = path.join(process.cwd(), 'public', 'uploads');

  console.log('Serving static files from:', uploadFolderPath); // To debug

  app.use('/uploads', express.static(uploadFolderPath));

  app.setGlobalPrefix('api');
  console.log('this is propetis length',properties.length)

  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(5000);

  // const propertyService = app.get(PropertyService)
  // console.log('running creating properties')
  // await propertyService.createProperties()
  // console.log('finished creating properties')
}
bootstrap();
