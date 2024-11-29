import { Request, Response } from 'express';
import { User } from '../../models';
import mongoose from 'mongoose';
import { validateUserUpdateData } from '../../lib/userValidator';
import { IUser } from 'types';

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user exists
    const existingUser: IUser | null = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Validate update data
    const validationErrors = validateUserUpdateData(updateData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        errors: validationErrors,
      });
      return;
    }

    // Check for unique constraints
    if (updateData.email) {
      const emailExists: IUser | null = await User.findOne({
        email: updateData.email,
      });

      if (emailExists && emailExists?._id?.toString() !== id) {
        res.status(400).json({
          success: false,
          error: 'Email already in use',
        });
        return;
      }
    }

    if (updateData.phone) {
      const phoneExists: IUser | null = await User.findOne({
        phone: updateData.phone,
      });

      if (phoneExists && phoneExists?._id?.toString() !== id) {
        res.status(400).json({
          success: false,
          error: 'Phone number already in use',
        });
        return;
      }
    }

    if (updateData.referralCode) {
      const referralCodeExists: IUser | null = await User.findOne({
        referralCode: updateData.referralCode,
      });

      if (referralCodeExists && referralCodeExists?._id?.toString() !== id) {
        res.status(400).json({
          success: false,
          error: 'Referral code already in use',
        });
        return;
      }
    }


    // Handle nested updates
    if (updateData.allAddress) {
      existingUser.allAddress = updateData.allAddress;
    }

    if (updateData.deliveryPersonDetails) {
      existingUser.deliveryPersonDetails = {
        ...existingUser.deliveryPersonDetails,
        ...updateData.deliveryPersonDetails,
      };
    }

    if (updateData.favouriteProducts) {
      // Ensure unique and valid ObjectIds
      const uniqueProducts = Array.from(
        new Set(updateData.favouriteProducts)
      ).filter((id): id is mongoose.Types.ObjectId => mongoose.isValidObjectId(id));

      if (uniqueProducts.length) {
        existingUser.favouriteProducts = uniqueProducts as [mongoose.Types.ObjectId];
      } else {
        res.status(400).json({
          success: false,
          error: 'Invalid favouriteProducts data',
        });
        return;
      }
    }

    if (updateData.favouriteStores) {
      // Ensure unique and valid ObjectIds
      const uniqueStores = Array.from(
        new Set(updateData.favouriteStores)
      ).filter((id): id is mongoose.Types.ObjectId => mongoose.isValidObjectId(id));

      if (uniqueStores.length) {
        existingUser.favouriteStores = uniqueStores as [mongoose.Types.ObjectId];
      } else {
        res.status(400).json({
          success: false,
          error: 'Invalid favouriteStores data',
        });
        return;
      }
    }

    if (updateData.cart) {
      // Validate cart items
      const validCart = updateData.cart.every(
        (item: any) =>
          item.product &&
          mongoose.isValidObjectId(item.product) &&
          item.quantity &&
          item.quantity > 0
      );

      if (!validCart) {
        res.status(400).json({
          success: false,
          error: 'Invalid cart items',
        });
        return;
      }
      existingUser.cart = updateData.cart;
    }

    // Handle premium status update
    if (updateData.isPremium !== undefined) {
      existingUser.isPremium = updateData.isPremium ? updateData.isPremium : null;
    }

    // Handle ban status
    if (updateData.isBanned !== undefined) {
      existingUser.isBanned = updateData.isBanned ? updateData.isBanned : null;
    }

    // Handle delete status
    if (updateData.isDeleted !== undefined) {
      existingUser.isDeleted = updateData.isDeleted ? updateData.isDeleted : false;
    }

    // Handle wallet detail
    // Handle wallet detail
    if (updateData.walletBalance !== undefined) {
      const isNumber = typeof updateData.walletBalance === 'number';
      const isStringNumber =
        typeof updateData.walletBalance === 'string' &&
        /^[+-]?\d+(\.\d+)?$/.test(updateData.walletBalance); // Regex for valid number

      if (isNumber || isStringNumber) {
        existingUser.walletBalance = parseFloat(updateData.walletBalance) || 0;
      } else {
        res.status(400).json({
          success: false,
          error: 'Invalid wallet balance',
        });
        return;
      }
    }


    // Remove sensitive fields
    delete updateData.password;
    delete updateData.isDeleted;
    delete updateData.walletBalance;

    // Update the user with validated fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updateData,
          allAddress: existingUser.allAddress,
          deliveryPersonDetails: existingUser.deliveryPersonDetails,
          favouriteProducts: existingUser.favouriteProducts,
          favouriteStores: existingUser.favouriteStores,
          cart: existingUser.cart,
          isPremium: existingUser.isPremium,
          isDeleted: existingUser.isDeleted,
          isBanned: existingUser.isBanned,
          walletBalance: existingUser.walletBalance
        },
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error: any) {
    await session.abortTransaction();

    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        error: Object.values(error.errors).map((err: any) => err.message),
      });
      return;
    }

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: 'Duplicate key error',
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  } finally {
    session.endSession();
  }
};
