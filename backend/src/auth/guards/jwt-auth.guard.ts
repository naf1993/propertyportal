// src/auth/guards/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Use AuthGuard from @nestjs/passport

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { // Specify 'jwt' strategy here
  constructor() {
    super();
  }
}
