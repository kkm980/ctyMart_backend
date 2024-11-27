import { OTPpurpose } from 'constants/enums';
import mongoose, { Schema } from 'mongoose';
import { IOTP } from 'types';

const otpSchema = new Schema<IOTP>(
  {
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    purpose: {
      type: String,
      enum: Object.values(OTPpurpose),
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export const OTPModel = mongoose.model<IOTP>('OTP', otpSchema);
