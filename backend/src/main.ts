import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';
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

  // try {
  //   const elasticservice = app.get(ElasticsearchService);
  //   // Ensure the Elasticsearch sync operation is completed before starting the app
  //   await elasticservice.syncPropertiesToElasticSearch();
  //   console.log('Elasticsearch sync completed');
  // } catch (error) {
  //   console.error('Error syncing properties to Elasticsearch:', error);
  // }

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
