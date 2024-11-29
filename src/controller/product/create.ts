import { Request, Response } from 'express';
import { Product, Store, Category } from '../../models';
import {
  validateProductName,
  validateDescription,
  validatePrice,
  validateMeasuringUnit,
  validateQuantity,
  validateCategories,
  validateImages
} from '../../lib/productValidator';
import { validateObjectId } from '../../lib/commonValidator';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  res.status(statusCode).json({ success: false, error: error.message || error });
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      storeId,
      name,
      description,
      price,
      measuringUnit,
      categories,
      availableQuantity,
      images
    } = req.body;

    // Validate storeId
    const storeIdValidation = validateObjectId(storeId, 'Store ID');
    if (!storeIdValidation.isValid) {
      return errorResponse(res, storeIdValidation.error);
    }

    // Check if store exists and is not deleted
    const store = await Store.findOne({ _id: storeId, isDeleted: false });
    if (!store) {
      return errorResponse(res, 'Store not found or has been deleted', 404);
    }

    // Validate fields
    const validations = [
      validateProductName(name),
      description ? validateDescription(description) : { isValid: true },
      validatePrice(price),
      validateMeasuringUnit(measuringUnit),
      availableQuantity !== undefined ? validateQuantity(availableQuantity) : { isValid: true },
      categories ? validateCategories(categories) : { isValid: true },
      images ? validateImages(images) : { isValid: true }
    ];

    for (const validation of validations) {
      if (!validation.isValid) {
        return errorResponse(res, validation.error);
      }
    }

    // If categories provided, validate their existence
    if (categories) {
      const existingCategories = await Category.find({
        _id: { $in: categories },
        isDeleted: false
      });
      if (existingCategories.length !== categories.length) {
        return errorResponse(res, 'One or more categories not found or have been deleted');
      }
    }

    // Check if product with the same name exists in this store
    const existingProduct = await Product.findOne({
      storeId,
      name,
      isDeleted: false
    });

    if (existingProduct) {
      return errorResponse(res, 'Product with this name already exists in this store');
    }

    // Create and save the product
    const product = new Product({
      storeId,
      name,
      description,
      price,
      measuringUnit,
      categories: categories || [],
      availableQuantity: availableQuantity || 500,
      images: images || [],
      isAvailable: true
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
