// src/auth/auth.controller.ts
import { Controller, Get, UseGuards,Post, UnauthorizedException,Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../auth/guards/google-auth.guard'; // We will create this guard
import { LoginDto } from './dto/logindto';
import { CreateUserDto } from './dto/createuserdto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Google OAuth login route
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Redirects to Google OAuth
  }

  // Google OAuth callback route
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect() {
    // The user is redirected here after Google authentication
    // You can create and return JWT token here
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
    return this.authService.generateJwtToken(user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

}
