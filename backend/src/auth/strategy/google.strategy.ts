// google.strategy.ts
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

export interface GoogleProfile {
  id: string; // Google ID
  emails: { value: string }[]; // Array of emails (usually one primary email)
  displayName: string; // Google user display name
}

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

  async validate(req: any, accessToken: string, refreshToken: string, profile: GoogleProfile, done: Function) {
    try {
      const { id, emails, displayName } = profile;
      const email = emails[0].value; // Usually, the first email is the primary email

      // Pass the Google ID, email, and display name to your service
      const user = await this.authService.validateGoogleUser(id, email, displayName);

      if (!user) {
        return done(new UnauthorizedException('User not found or unauthorized'), false);
      }

      return done(null, user); // Pass the user to the next step (auth controller)
    } catch (err) {
      return done(err, false);
    }
  }
}
