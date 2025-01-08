import { Schema, Document } from 'mongoose';
import mongoose from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
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

export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  profilePicture: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  role: { type: String, enum: ['admin', 'agent', 'owner', 'tenant'], required: true },
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

export const UserModel = mongoose.model<User>('User', UserSchema);
