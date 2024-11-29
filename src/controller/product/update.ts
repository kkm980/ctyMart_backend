import { Request, Response } from 'express';
import { Product, Category } from '../../models';
import {
  validateProductName,
  validateDescription,
  validatePrice,
  validateMeasuringUnit,
  validateQuantity,
  validateCategories,
  validateImages,
} from '../../lib/productValidator';
import { validateObjectId } from '../../lib/commonValidator';
import mongoose from 'mongoose';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  res.status(statusCode).json({ success: false, error: error.message || error });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      measuringUnit,
      categories,
      availableQuantity,
      images,
      isAvailable,
      isPremium,
      isBanned,
      isDeleted,
    } = req.body;
    const productIdValidation = validateObjectId(id, 'Product ID');
    if (!productIdValidation.isValid) {
      return errorResponse(res, productIdValidation.error, 400);
    }

    const existingProduct = await Product.findOne({ _id: id }).session(session);
    if (!existingProduct) {
      return errorResponse(res, 'Product not found or has been deleted', 404);
    }

    const updateData: any = {};

    if (name !== undefined) {
      const nameValidation = validateProductName(name);
      if (!nameValidation.isValid) return errorResponse(res, nameValidation.error);

      const duplicateProduct = await Product.findOne({
        _id: { $ne: id },
        storeId: existingProduct.storeId,
        name,
        isDeleted: false,
      }).session(session);
      if (duplicateProduct) {
        return errorResponse(res, 'Another product with this name already exists in the store');
      }
      updateData.name = name;
    }

    if (description !== undefined) {
      const descValidation = validateDescription(description);
      if (!descValidation.isValid) return errorResponse(res, descValidation.error);
      updateData.description = description;
    }

    if (price !== undefined) {
      const priceValidation = validatePrice(price);
      if (!priceValidation.isValid) return errorResponse(res, priceValidation.error);
      updateData.price = price;
    }

    if (measuringUnit !== undefined) {
      const unitValidation = validateMeasuringUnit(measuringUnit);
      if (!unitValidation.isValid) return errorResponse(res, unitValidation.error);
      updateData.measuringUnit = measuringUnit;
    }

    if (availableQuantity !== undefined) {
      const quantityValidation = validateQuantity(availableQuantity);
      if (!quantityValidation.isValid) return errorResponse(res, quantityValidation.error);

      updateData.availableQuantity = availableQuantity;
      updateData.isAvailable = availableQuantity > 0;
    }

    if (categories !== undefined) {
      const categoriesValidation = validateCategories(categories);
      if (!categoriesValidation.isValid) return errorResponse(res, categoriesValidation.error);

      const existingCategories = await Category.find({
        _id: { $in: categories },
        isDeleted: false,
      }).session(session);
      if (existingCategories.length !== categories.length) {
        return errorResponse(res, 'One or more categories not found or have been deleted');
      }
      updateData.categories = categories;
    }

    if (images !== undefined) {
      const imagesValidation = validateImages(images);
      if (!imagesValidation.isValid) return errorResponse(res, imagesValidation.error);
      updateData.images = images;
    }

    if (isAvailable !== undefined) {
      updateData.isAvailable = isAvailable;
    }

    if (isPremium !== undefined) {
      updateData.isPremium = isPremium ? isPremium : null;
    }

    if (isBanned !== undefined) {
      updateData.isBanned = isBanned ? isBanned : null;
    }

    if (isDeleted !== undefined) {
      updateData.isDeleted = isDeleted ? isDeleted : false;
    }

    if (Object.keys(updateData).length === 0) {
      return errorResponse(res, 'No valid update data provided');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    await session.abortTransaction();
    return errorResponse(res, error);
  } finally {
    session.endSession();
  }
};
