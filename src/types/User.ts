// src/types/User
import mongoose, { Document } from 'mongoose';
import { UserRoleTypes } from './UserRoleTypes';

// User interface
export interface IUser extends Document {
  email?: string;
  password: string;
  name: string;
  phone: string;
  role: UserRoleTypes;
  walletBalance: number;
  referralCode?: string;
  referredBy?: mongoose.Types.ObjectId;
  isPhoneVerified: boolean;
  allAddress: [{
    address: string;
    location: [number, number];
  }];
  deliveryPersonDetails?: {
    location: [number, number];
    isAvailable: boolean;
    vehicleNumber?: string;
    licenseNumber?: string;
    rating: number;
  };
  appNotificationsEnabled?: boolean;
  favouriteProducts?:[mongoose.Types.ObjectId];
  favouriteStores?:[mongoose.Types.ObjectId];
  cart?: [{item:mongoose.Types.ObjectId, quantity: number}];
  isPremium: Date | null;
  isDeleted: boolean;
  isBanned: Date | null;
}