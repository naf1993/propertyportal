// src/user/dto/update-user.dto.ts
import { IsEmail, IsEnum, IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';
import { UserRole } from '../user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsString()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsString()
  readonly profilePicture?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly city?: string;

  @IsOptional()
  @IsString()
  readonly state?: string;

  @IsOptional()
  @IsString()
  readonly country?: string;

  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: 'admin' | 'agent' | 'owner' | 'tenant';

  @IsOptional()
  @IsBoolean()
  readonly isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isBanned?: boolean;

  @IsOptional()
  @IsString()
  readonly resetPasswordToken?: string;

  @IsOptional()
  @IsDate()
  readonly resetPasswordExpires?: Date;

  @IsOptional()
  @IsDate()
  readonly emailVerifiedAt?: Date;

  @IsOptional()
  @IsDate()
  readonly lastLogin?: Date;

  @IsOptional()
  readonly propertiesOwned?: string[];

  @IsOptional()
  readonly propertiesManaged?: string[];

  @IsOptional()
  @IsEnum(['free', 'premium'])
  readonly subscriptionType?: 'free' | 'premium';

  @IsOptional()
  @IsString()
  readonly paymentMethod?: string;

  @IsOptional()
  @IsEnum(['paid', 'unpaid'])
  readonly paymentStatus?: 'paid' | 'unpaid';

  @IsOptional()
  @IsDate()
  readonly planExpiryDate?: Date;

  @IsOptional()
  readonly favorites?: string[];

  @IsOptional()
  readonly views?: string[];

  @IsOptional()
  readonly inquiries?: string[];

  @IsOptional()
  readonly notifications?: string[];

  @IsOptional()
  @IsBoolean()
  readonly emailNotificationsEnabled?: boolean;

  @IsOptional()
  @IsDate()
  readonly dateJoined?: Date;

  @IsOptional()
  @IsString()
  readonly preferredLanguage?: string;

  @IsOptional()
  @IsString()
  readonly referralCode?: string;
}
