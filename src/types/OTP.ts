import { Document } from 'mongoose';

export interface IOTP extends Document {
  phone: string;          // User's phone number
  otp: string;            // One-Time Password
  purpose: 'signup' | 'login' | 'password_reset'; // Purpose of OTP
  expiresAt: Date;        // Expiration time of the OTP
  createdAt?: Date;       // Automatically managed by mongoose
  updatedAt?: Date;       // Automatically managed by mongoose
}
