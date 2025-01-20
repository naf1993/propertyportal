import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { JwtPayload } from '../auth/auth.interface';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/createuserdto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async validateUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (user) {
      return user;
    }
    return null;
  }

  async validateUserByCredentials(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      return null; // User not found
    }

    console.log('email', email);
    console.log('password (received):', password);
    console.log('password (stored):', user.password); // Log the stored password

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log('Password match successful');
      return user; // Passwords match
    } else {
      console.log('Password mismatch');
      return null; // Passwords do not match
    }
  }

  async generateJwtToken(user: any) {
    const payload = { username: user.username, sub: user.userId };
    console.log('Generating JWT Token with payload:', payload);
    console.log(
      'Using JWT_SECRET_KEY:',
      this.configService.get<string>('JWT_SECRET_KEY'),
    );
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }),
    };
  }

  async validateGoogleToken(token: string): Promise<User | null> {
    try {
      // Verify the token using Google's API
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Verify the token matches your client ID
      });

      const payload = ticket.getPayload();
      const googleId = payload?.sub;
      const email = payload?.email;
      const name = payload?.name;

      if (!googleId || !email) {
        throw new Error('Invalid Google token');
      }

      // Find or create the user
      return this.validateGoogleUser(googleId, email, name);
    } catch (error) {
      console.error('Google token validation failed', error);
      return null;
    }
  }

  async validateGoogleUser(googleId: string, email: string, name: string) {
    let user = await this.userModel.findOne({ googleId });
    if (!user) {
      user = await this.userModel.create({
        googleId,
        email,
        name,
        role: 'tenant',
      });
    }
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const { name, email, password, role = 'tenant' } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });
    console.log('this is existing user', existingUser);

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const payload: JwtPayload = { userId: newUser._id.toString() };
    console.log('Generating JWT Token for user:', newUser); // Debug log
    console.log('env',this.configService.get<string>('JWT_SECRET_KEY'))
    return {
      user: newUser,
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'), // Explicitly pass the secret key here
      }),
    };
  }
}
