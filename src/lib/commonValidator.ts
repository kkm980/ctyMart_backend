// src/lib/commonValidator.ts

import { isValidObjectId } from 'mongoose';

export const validateStringLength = (
  str: string,
  minLength: number,
  maxLength: number,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (!str || typeof str !== 'string') {
    return { 
      isValid: false, 
      error: `${fieldName} must be a valid string` 
    };
  }

  const trimmedStr = str.trim();
  
  if (trimmedStr.length < minLength || trimmedStr.length > maxLength) {
    return { 
      isValid: false, 
      error: `${fieldName} must be between ${minLength} and ${maxLength} characters` 
    };
  }

  return { isValid: true };
};

export const validateNumber = (
  num: number,
  min: number,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (typeof num !== 'number' || isNaN(num) || num < min) {
    return { 
      isValid: false, 
      error: `${fieldName} must be a valid number greater than or equal to ${min}` 
    };
  }
  return { isValid: true };
};

export const validateArray = <T>(
  arr: T[],
  validator: (item: T) => boolean,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (!Array.isArray(arr)) {
    return { 
      isValid: false, 
      error: `${fieldName} must be an array` 
    };
  }

  if (!arr.every(validator)) {
    return { 
      isValid: false, 
      error: `One or more ${fieldName} are invalid` 
    };
  }

  return { isValid: true };
};

export const validateObjectId = (
  id: string,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (!isValidObjectId(id)) {
    return { 
      isValid: false, 
      error: `Invalid ${fieldName} format` 
    };
  }
  return { isValid: true };
};