import { MeasureType } from '../constants/enums';
import { 
  validateStringLength, 
  validateNumber, 
  validateArray, 
  validateObjectId 
} from './commonValidator';

export const validateProductName = (name: string) => {
  return validateStringLength(name, 2, 30, 'Product name');
};

export const validateDescription = (description?: string) => {
  if (!description) return { isValid: true };
  return validateStringLength(description, 10, 500, 'Description');
};

export const validatePrice = (price: number) => {
  return validateNumber(price, 0, 'Price');
};

export const validateMeasuringUnit = (unit: string) => {
  if (!Object.values(MeasureType).includes(unit as MeasureType)) {
    return {
      isValid: false,
      error: 'Invalid measuring unit'
    };
  }
  return { isValid: true };
};

export const validateQuantity = (quantity: number) => {
  return validateNumber(quantity, 0, 'Quantity');
};

export const validateCategories = (categories: string[]) => {
  return validateArray(
    categories,
    (category) => validateObjectId(category, 'Category').isValid,
    'Categories'
  );
};

export const validateImages = (images: string[]) => {
  return validateArray(
    images,
    (image) => typeof image === 'string' && image.trim().length > 0,
    'Images'
  );
};