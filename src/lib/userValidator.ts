import { UserRole } from '../constants/enums';

export const validateLocation = (location: number[]) => {
  return (
    Array.isArray(location) &&
    location.length === 2 &&
    location[0] >= -180 && location[0] <= 180 &&
    location[1] >= -90 && location[1] <= 90
  );
};

export const validateEmail = (email: string) => {
  return /.+@.+\..+/.test(email);
};

export const validatePhone = (phone: string) => {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
};

export const validateVehicleAndLicense = (value: string) => {
  return /^[A-Z0-9-]+$/.test(value);
};

export const validateUserUpdateData = (data: any) => {
  const errors = [];

  // Basic field validations
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }

  if (data.password && data.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (data.role && !Object.values(UserRole).includes(data.role)) {
    errors.push('Invalid user role');
  }

  // Address validation
  if (data.allAddress) {
    if (!Array.isArray(data.allAddress)) {
      errors.push('allAddress must be an array');
    } else {
      data.allAddress.forEach((addr: any, index: number) => {
        if (!addr.address) {
          errors.push(`Address is required for address entry ${index + 1}`);
        }
        if (!addr.location || !validateLocation(addr.location)) {
          errors.push(`Invalid location coordinates for address entry ${index + 1}`);
        }
      });
    }
  }

  // Delivery person details validation
  if (data.deliveryPersonDetails) {
    const { vehicleNumber, licenseNumber, rating } = data.deliveryPersonDetails;
    
    if (vehicleNumber && !validateVehicleAndLicense(vehicleNumber)) {
      errors.push('Invalid vehicle number format');
    }
    
    if (licenseNumber && !validateVehicleAndLicense(licenseNumber)) {
      errors.push('Invalid license number format');
    }
    
    if (rating !== undefined && (rating < 0 || rating > 5)) {
      errors.push('Rating must be between 0 and 5');
    }
  }

  return errors;
};