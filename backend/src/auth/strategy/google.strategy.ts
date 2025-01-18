// src/auth/strategy/google.strategy.ts
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(GoogleStrategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    });
  }

  // The validate method is automatically called when the user logs in via Google
  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      const { emails, id, displayName } = profile;
      const email = emails[0].value;

      // Call your authentication service to check or create the user
      const user = await this.authService.validateGoogleUser(email, id);

      if (!user) {
        return done(new UnauthorizedException('User not found or unauthorized'), false);
      }

      // If the user is found, pass the user object to the 'done' callback
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
}
