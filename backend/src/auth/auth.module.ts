import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy'; // Import the JwtStrategy
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Import the guard
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),  // Ensure defaultStrategy is set to 'jwt'
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourjwtsecretkey', // Secret key for signing JWT
      signOptions: { expiresIn: '1h' },  // Optionally configure token expiration
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,  // Register the JwtStrategy
    JwtAuthGuard,  // Register the JwtAuthGuard
  ],
  controllers: [AuthController],
})
export class AuthModule {}
