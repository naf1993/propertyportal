//src/app/module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ElasticSearchModule } from './elasticsearch/elasticsearch.module';

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
    AuthModule,
    ElasticSearchModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, JwtService],
})
export class AppModule {
  constructor() {
    console.log('JWT_SECRET_KEY immediately after ConfigModule:', process.env.JWT_SECRET_KEY); console.log('MONGO_URL:', process.env.MONGO_URL); // Check other env variables as well
  }
}
