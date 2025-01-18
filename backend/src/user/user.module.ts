import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';  // Import the schema (not the model)

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),  // Use 'User' for model name and UserSchema for the schema
  ],
  exports: [MongooseModule,UserService],  // Export to be used in other modules
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
