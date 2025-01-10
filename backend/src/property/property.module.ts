import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { PropertySchema } from './property.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Property', schema: PropertySchema }])
  ],
  providers: [PropertyService,CloudinaryService],
  controllers: [PropertyController],
})
export class PropertyModule {}
