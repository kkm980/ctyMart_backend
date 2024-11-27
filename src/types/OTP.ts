import { Document } from 'mongoose';
import { OTPpurpose } from './OTPpurpose';

export interface IOTP extends Document {
  phone: string;          // User's phone number
  otp: string;            // One-Time Password
  purpose: OTPpurpose;    // Purpose of OTP
  expiresAt: Date;        // Expiration time of the OTP
}
