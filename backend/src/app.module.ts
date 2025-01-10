import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '../../.env'), // Correctly reference the .env file in the project root
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL ?? (() => {
      throw new Error('MONGO_URL is not defined in the environment variables!');
    })()),
    PropertyModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('All environment variables:', process.env); // Log environment variables for debugging
    console.log('MONGO_URL:', process.env.MONGO_URL); // Log MONGO_URL for debugging
  }
}
