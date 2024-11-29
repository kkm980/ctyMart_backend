import { Request, Response } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { Store } from '../../models/Store';
import { validateStringLength, validateObjectId, validateArray } from '../../lib/commonValidator';
import {validateLocation, validateContacts, validateOperatingHours} from "../../lib/storeValidator";
import { User } from '../../models/User';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  res.status(statusCode).json({ success: false, error: error.message || error });
};

export const updateStore = async (req: Request, res: Response): Promise<void> => {
  const { id: storeId } = req.params;
  const updateFields = req.body;

  // Validate storeId
  const { isValid: isStoreIdValid, error: storeIdError } = validateObjectId(storeId, 'storeId');
  if (!isStoreIdValid) return errorResponse(res, storeIdError, 400);

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch store within the session
    const store = await Store.findById(storeId);
    if (!store) {
      await session.abortTransaction();
      return errorResponse(res, 'Store not found', 404);
    }

    const updateData: any = {};

    // Validate name
    if(updateFields?.name){
      if (updateFields?.name?.length < 3 || updateFields?.name?.length > 50) {
        res.status(400).json({
          success: false,
          error: 'Store name must be between 3 and 50 characters',
        });
        return;
      } else {
        updateData.name = updateFields.name;
      }
    }

    if (updateFields.description) {
      const { isValid, error } = validateStringLength(updateFields.description, 0, 200, 'description');
      if (!isValid) return errorResponse(res, error);
      updateData.description = updateFields.description;
    }

    if (updateFields.address) {
      const { isValid, error } = validateStringLength(updateFields.address, 5, 100, 'address');
      if (!isValid) return errorResponse(res, error);
      updateData.address = updateFields.address;
    }

    // Validate location
    if (updateFields.location) {
      if (!validateLocation(updateFields.location)) {
        res.status(400).json({
          success: false,
          error: 'Invalid location format. Expected [latitude, longitude]',
        });
        return;
      }
      else {
        updateData.location = updateFields.location;
      }
    }

        // Validate contacts
    if(updateFields.contact){
      if (!validateContacts(updateFields.contact)) {
        res.status(400).json({
          success: false,
          error: 'Invalid contact format',
        });
        return;
      }else {
        updateData.contact = updateFields.contact;
      }
    }


    if (updateFields.owner) {

      // Validate owner ID
      if (!isValidObjectId(updateFields.owner)) {
        res.status(400).json({
          success: false,
          error: 'Invalid owner ID format',
        });
        return;
      }

      // Check if owner exists
      const ownerExists = await User.findById(updateFields.owner);
      if (!ownerExists) {
        res.status(404).json({
          success: false,
          error: 'Owner not found',
        });
        return;
      }
      updateData.owner = updateFields.owner;
    }

    if (updateFields.managers) {
      if (!updateFields.managers.every(isValidObjectId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid manager ID format',
        });
        return;
      }

      // Check if all managers exist
      const managersExist = await User.find({ _id: { $in: updateFields.managers } });
      if (managersExist.length !== updateFields.managers?.length) {
        res.status(404).json({
          success: false,
          error: 'One or more managers not found',
        });
        return;
      }
      updateData.managers = updateFields.managers;
    }

    // Validate categories if provided
    if (updateFields.categories && updateFields.categories.length > 0) {
      if (!updateFields?.categories.every(isValidObjectId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID format',
        });
        return;
      }
      updateData.categories = updateFields.categories;
    }

  
    // Validate operating hours
    if(updateFields.operatingHours){
      if (!validateOperatingHours(updateFields.operatingHours)) {
        res.status(400).json({
          success: false,
          error: 'Invalid operating hours format',
        });
        return;
      } else {
        updateData.operatingHours = updateFields.operatingHours;
      }
    }

    if (typeof updateFields.isOpen === 'boolean') {
      updateData.isOpen = updateFields.isOpen;
    }

    if (typeof updateFields.isTopPerformer === 'boolean') {
      updateData.isTopPerformer = updateFields.isTopPerformer;
    }

    if (updateFields.isCertified) {
      updateData.isCertified = new Date(updateFields.isCertified);
    }

    if (updateFields.images) {
      const { isValid, error } = validateArray<string>(updateFields.images, img => typeof img === 'string', 'images');
      if (!isValid) return errorResponse(res, error);
      updateData.images = updateFields.images;
    }

    if (Object.keys(updateData).length === 0) {
      return errorResponse(res, 'No valid update data provided', 400);
    }

    // Save store within the transaction
    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      { $set: updateData },
      { new: true, runValidators: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: updatedStore,
    });
  } catch (error: any) {
    // Rollback the transaction in case of any error
    await session.abortTransaction();
    return errorResponse(res, error);
  } finally {
    // End the session
    session.endSession();
  }
};
