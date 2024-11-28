import { Request, Response } from 'express';
import { User } from '../../models';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, error: error.message || error });
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      name,
      phone,
      role,
      referralCode,
      referredBy,
      allAddress,
      deliveryPersonDetails,
      isPremium,
    } = req.body;

    // Validate required fields
    if (!password || password.length < 8) {
      res.status(400).json({
        success: false,
        error: 'Password is required and must be at least 8 characters long.',
      });
      return;
    }

    if (!name || !phone) {
      res.status(400).json({
        success: false,
        error: 'Name and phone are required fields.',
      });
      return;
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      phone,
      role,
      referralCode,
      referredBy,
      allAddress,
      deliveryPersonDetails:deliveryPersonDetails||null,
      isPremium,
    });

    await user.save();
    res.status(201).json({ success: true, message: 'User created successfully.', data: user });
  } catch (error) {
    errorResponse(res, error);
  }
};
