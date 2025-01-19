// src/auth/auth.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Post,
  Req,
  UnauthorizedException,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../auth/guards/google-auth.guard'; // We will create this guard
import { LoginDto } from './dto/logindto';
import { CreateUserDto } from './dto/createuserdto';
import { Request } from 'express';
import { GoogleProfile } from './strategy/google.strategy';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard) // Protect this route with the JwtAuthGuard
  @Get('user')
  getUser(@Req() req: Request) {
    return req.user;
  }
  // Google OAuth login route
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Redirects to Google OAuth
  }

  @Get('google/callback') @UseGuards(GoogleAuthGuard) async googleAuthRedirect(
    @Req() req: Request,
  ) {
    const googleUser = req.user as GoogleProfile;
    if (!googleUser) {
      throw new UnauthorizedException('Google authentication failed');
    }
    const { id: googleId, emails, displayName: name } = googleUser;
    const email = emails[0].value;
    const user = await this.authService.validateGoogleUser(
      googleId,
      email,
      name,
    );
    const { access_token } = await this.authService.generateJwtToken(user);
    return { access_token, user };
  }
  // JWT Login
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUserByCredentials(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove the password from the user object before sending the response
    const { password, ...userWithoutPassword } = user.toObject(); // or user.toJSON() based on your schema
    const { access_token } = await this.authService.generateJwtToken(user);

    return { access_token, user: userWithoutPassword };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }
}
