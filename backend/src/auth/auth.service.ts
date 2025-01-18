import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';  // Import InjectModel
import { Model } from 'mongoose';  // Import Model
import { User } from '../user/user.schema';  // Make sure this points to the User model
import { JwtPayload } from '../auth/auth.interface';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/createuserdto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService, private readonly userService: UserService,
    @InjectModel('User') private userModel: Model<User>,  // Inject the User model here
  ) {}

  // Validate user by userId (for JWT)
  async validateUser(userId: string) {
    const user = await this.userModel.findById(userId);  // Using userId passed from JWT payload
    if (user) {
      return user;
    }
    return null;
  }

  // Method for login validation (expects email and password)
  async validateUserByCredentials(email: string, password: string) {
    const user = await this.userModel.findOne({ email });  // Correct query by email
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  // Generate JWT Token
  async generateJwtToken(user: User) {
    const payload: JwtPayload = { userId: user._id.toString() };  // Ensure _id is a string
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateGoogleUser(googleId: string, email: string) {
    // Find user in the database or create a new one if it doesn't exist
    let user = await this.userModel.findOne({ googleId });
    if (!user) {
      user = await this.userModel.create({ googleId, email, role: 'tenant' }); // Default to 'tenant' role for Google users
    }
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const { name,email, password, role = 'tenant' } = createUserDto; // Default role to 'tenant'
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      role,  // Role is passed in or defaulted to 'tenant'
    });

    await newUser.save();

    const payload: JwtPayload = { userId: newUser._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
