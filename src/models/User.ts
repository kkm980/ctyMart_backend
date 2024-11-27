// src/models/User.ts

import mongoose, { Schema } from 'mongoose';
import { IUser } from 'types';

const userSchema = new Schema<IUser>({
    email: {
      type: String,
      unique: true,
      sparse: true, // Makes the field optional but ensures no duplicates if provided
      match: [/.+@.+\..+/, 'Please enter a valid email address.'], // Email format validation
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'], // Minimum length for password
    },
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true, // Ensures phone numbers are unique
      match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number.'], // Phone number validation
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'juniorAdmin', 'storeOwner', 'deliveryPartner'],
      default: 'customer', // Default role is 'customer'
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: [0, 'Wallet balance cannot be less than 0'], // Ensure wallet balance is non-negative
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true, // Makes the field optional but ensures no duplicates if provided
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to another User (the person who referred)
    },
    isPhoneVerified: {
      type: Boolean,
      default: false, // Default value is false
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    location: {
      type: [Number],
      required: [true, 'Location is required'],
      validate: {
        validator: (value: [number, number]) => {
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            value[0] >= -180 && value[0] <= 180 && // Longitude between -180 and 180
            value[1] >= -90 && value[1] <= 90 // Latitude between -90 and 90
          );
        },
        message: 'Invalid location. Coordinates must be [longitude, latitude].',
      },
    },
    deliveryPersonDetails: {
      location: {
        type: [Number],
        validate: {
          validator: (value: [number, number]) => {
            return (
              Array.isArray(value) &&
              value.length === 2 &&
              value[0] >= -180 && value[0] <= 180 && // Longitude between -180 and 180
              value[1] >= -90 && value[1] <= 90 // Latitude between -90 and 90
            );
          },
          message: 'Invalid location. Coordinates must be [longitude, latitude].',
        },
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
      vehicleNumber: {
        type: String,
        match: [/^[A-Z0-9-]+$/, 'Invalid vehicle number'], // Example pattern for vehicle number validation
      },
      licenseNumber: {
        type: String,
        match: [/^[A-Z0-9-]+$/, 'Invalid license number'], // Example pattern for license number validation
      },
      rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be greater than 5'],
      },
    },
  }, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  });
  
  const User = mongoose.model<IUser>('User', userSchema);
  
  export { User };