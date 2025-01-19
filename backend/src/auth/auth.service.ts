// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { JwtPayload } from '../auth/auth.interface';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/createuserdto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService, private readonly userService: UserService,
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
  
  

  async generateJwtToken(user: User) {
    const payload: JwtPayload = { userId: user._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateGoogleUser(googleId: string, email: string, displayName: string) {
    // Try to find a user with the same Google ID
    let user = await this.userModel.findOne({ googleId });

    if (!user) {
      // If user is not found, create a new one
      user = new this.userModel({
        googleId,
        email,
        name: displayName,
        role: 'tenant', // Default role
        isVerified: true, // Assuming Google users are verified
        isActive: true,
        isBanned: false,
      });
      await user.save();
    }

    return user;
  }
  

  async register(createUserDto: CreateUserDto) {
    const { name, email, password, role = 'tenant' } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });

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
    return {
      user: newUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}
