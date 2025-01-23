import { Schema, Document, model } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  SELLER = 'seller',
  BUYER = 'buyer',
}

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  googleId?: string; // Google OAuth ID
  profilePicture?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  role: 'admin' | 'agent' | 'owner' | 'tenant';
  isVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerifiedAt?: Date;
  lastLogin?: Date;
  propertiesOwned?: Schema.Types.ObjectId[]; // Reference to Property collection
  propertiesManaged?: Schema.Types.ObjectId[]; // Reference to Property collection
  subscriptionType?: 'free' | 'premium';
  paymentMethod?: string;
  paymentStatus?: 'paid' | 'unpaid';
  planExpiryDate?: Date;
  favorites?: Schema.Types.ObjectId[]; // Array of property IDs
  views?: Schema.Types.ObjectId[]; // Array of viewed property IDs
  inquiries?: Schema.Types.ObjectId[]; // Array of inquiry IDs (messages or contact requests)
  notifications?: string[];
  emailNotificationsEnabled?: boolean;
  dateJoined?: Date;
  preferredLanguage?: string;
  referralCode?: string;
}
export interface UserRecommendation extends Document {
  userId: Schema.Types.ObjectId;
  recommendations: [{ properties: Schema.Types.ObjectId[]; score: Number }];
}

export const UserRecommendationSchema = new Schema<UserRecommendation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  recommendations: [
    {
      properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
      score: { type: Number, required: true },
    },
  ],
});
// Define a Mongoose schema for the User model
export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  googleId: { type: String, unique: false },
  profilePicture: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  role: {
    type: String,
    enum: ['admin', 'agent', 'tenant'],
    required: true,
    default: 'tenant', // Default role set to 'tenant'
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  emailVerifiedAt: { type: Date },
  lastLogin: { type: Date },
  propertiesOwned: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  propertiesManaged: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  subscriptionType: { type: String, enum: ['free', 'premium'] },
  paymentMethod: { type: String },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'] },
  planExpiryDate: { type: Date },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  views: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  inquiries: [{ type: Schema.Types.ObjectId, ref: 'Inquiry' }],
  notifications: [{ type: String }],
  emailNotificationsEnabled: { type: Boolean, default: true },
  dateJoined: { type: Date, default: Date.now },
  preferredLanguage: { type: String },
  referralCode: { type: String },
});

// Create a Mongoose model for the User
export const UserRecommendationModel = model<UserRecommendation>('UserRecommendation',UserRecommendationSchema)
export const UserModel = model<User>('User', UserSchema);
