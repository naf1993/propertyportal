import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { PropertySchema } from './property.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserSchema } from 'src/user/user.schema';
import { ElasticSearchModule } from 'src/elasticsearch/elasticsearch.module';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Property', schema: PropertySchema },
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [PropertyService, CloudinaryService,ElasticsearchService],
  controllers: [PropertyController],
})
export class PropertyModule {}
