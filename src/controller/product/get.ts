import { Request, Response } from 'express';
import { Product } from '../../models';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, error: error.message || error });
};

// Controller to get all product based on filters
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = req.body; // Filters passed in the request body

    // Validate filters if necessary (optional step)
    if (typeof filters !== 'object') {
      res.status(400).json({
        success: false,
        error: 'Filters must be provided as an object.',
      });
      return;
    }

    // Find product based on filters
    const product = await Product.find({...filters, isDeleted: false});

    res.status(200).json({
      success: true,
      message: 'product retrieved successfully.',
      data: product,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
