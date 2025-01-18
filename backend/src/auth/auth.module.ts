// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleOAuthStrategy } from './strategy/google.strategy'; // Import the correct strategy
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Protect routes with JWT
import { UserModule } from 'src/user/user.module'; // Import the UserModule

@Module({
  imports: [
    UserModule,          // Make sure UserModule is imported
    PassportModule,      // Make sure Passport is imported for authentication
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey', // Secret key for signing JWT
      signOptions: { expiresIn: '1h' },  // Optionally configure token expiration
    }),
  ],
  providers: [
    AuthService,         // Authentication service that handles JWT logic
    GoogleOAuthStrategy, // Google OAuth strategy
    JwtAuthGuard,        // JWT Auth Guard to protect routes
  ],
  controllers: [AuthController], // Controller to handle authentication routes
})
export class AuthModule {}
