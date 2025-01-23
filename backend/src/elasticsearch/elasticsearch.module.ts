//src/elasticsearch/elasticsearch.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ElasticsearchService } from './elasticsearch.service';
import { PropertySchema } from 'src/property/property.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Property', schema: PropertySchema }
    ]),
  ],
  providers: [ElasticsearchService],
  controllers: [],
})
export class ElasticSearchModule {}