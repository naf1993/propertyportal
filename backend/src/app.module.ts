import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    
    MongooseModule.forRoot(process.env.MONGO_URL ?? (() => {
      throw new Error('MONGO_URL is not defined in the environment variables!');
    })()),
    PropertyModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {
  constructor() {}
}
