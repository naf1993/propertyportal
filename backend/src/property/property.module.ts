import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { PropertySchema } from './property.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserSchema } from 'src/user/user.schema';

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
  providers: [PropertyService, CloudinaryService],
  controllers: [PropertyController],
})
export class PropertyModule {}
