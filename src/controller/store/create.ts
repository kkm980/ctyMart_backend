import { Request, Response } from 'express';
import { Store, User } from '../../models';
import { validateOperatingHours, validateLocation, validateContacts } from '../../lib/storeValidator';
import { isValidObjectId } from 'mongoose';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, error: error.message || error });
};

export const createStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      address,
      location,
      owner,
      managers,
      contact,
      categories,
      operatingHours,
      images,
      minProductPrice,
      maxProductPrice,
    } = req.body;

    // Required fields validation
    if (!name || !address || !location || !owner || !contact || !operatingHours) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
      return;
    }

    // Validate name
    if (name.length < 3 || name.length > 50) {
      res.status(400).json({
        success: false,
        error: 'Store name must be between 3 and 50 characters',
      });
      return;
    }

    // Validate owner ID
    if (!isValidObjectId(owner)) {
      res.status(400).json({
        success: false,
        error: 'Invalid owner ID format',
      });
      return;
    }

    // Check if owner exists
    const ownerExists = await User.findById(owner);
    if (!ownerExists) {
      res.status(404).json({
        success: false,
        error: 'Owner not found',
      });
      return;
    }

    // Validate location
    if (!validateLocation(location)) {
      res.status(400).json({
        success: false,
        error: 'Invalid location format. Expected [latitude, longitude]',
      });
      return;
    }

    // Validate contacts
    if (!validateContacts(contact)) {
      res.status(400).json({
        success: false,
        error: 'Invalid contact format',
      });
      return;
    }

    // Validate operating hours
    if (!validateOperatingHours(operatingHours)) {
      res.status(400).json({
        success: false,
        error: 'Invalid operating hours format',
      });
      return;
    }

    // Validate managers if provided
    if (managers && managers.length > 0) {
      if (!managers.every(isValidObjectId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid manager ID format',
        });
        return;
      }

      // Check if all managers exist
      const managersExist = await User.find({ _id: { $in: managers } });
      if (managersExist.length !== managers.length) {
        res.status(404).json({
          success: false,
          error: 'One or more managers not found',
        });
        return;
      }
    }

    // Validate categories if provided
    if (categories && categories.length > 0) {
      if (!categories.every(isValidObjectId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID format',
        });
        return;
      }
    }

    // Validate minProductPrice and maxProductPrice
    if ((minProductPrice !== undefined && maxProductPrice !== undefined) && +minProductPrice > +maxProductPrice) {
      res.status(400).json({
        success: false,
        error: 'minProductPrice cannot be greater than maxProductPrice',
      });
      return;
    }

    // Check if store with same name exists
    const existingStore = await Store.findOne({ name, isDeleted: false });
    if (existingStore) {
      res.status(400).json({
        success: false,
        error: 'Store with this name already exists',
      });
      return;
    }

    // Create store
    const store = new Store({
      name,
      description,
      address,
      location,
      owner,
      managers: managers || [],
      contact,
      categories: categories || [],
      operatingHours,
      images: images || [],
      minProductPrice: minProductPrice || 0,
      maxProductPrice: maxProductPrice || 0,
    });

    await store.save();

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
