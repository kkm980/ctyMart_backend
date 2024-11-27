// src/types/User
import mongoose, { Document } from 'mongoose';

// User interface
export interface IUser extends Document {
  email?: string;
  password: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin' | 'juniorAdmin' | 'storeOwner' |  'manager' | 'deliveryPartner';
  walletBalance: number;
  referralCode?: string;
  referredBy?: mongoose.Types.ObjectId;
  isPhoneVerified: boolean;
  address: string;
  location: [number, number];
  deliveryPersonDetails?: {
    location: [number, number];
    isAvailable: boolean;
    vehicleNumber?: string;
    licenseNumber?: string;
    rating: number;
  };
}