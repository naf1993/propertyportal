import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';  // Import the User interface for type safety

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,  // Inject the model created from the schema
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async createUser(userData: { email: string; password: string; name: string }): Promise<User> {
    const newUser = new this.userModel(userData);  // Create a new user document
    return newUser.save();  // Save the new user to the database
  }

 
}
