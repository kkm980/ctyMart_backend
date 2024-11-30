import { Request, Response } from 'express';
import { Order } from '../../models';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, error: error.message || error });
};

// Controller to get all order based on filters
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
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

    // Find order based on filters
    const order = await Order.find({...filters, isDeleted: false});

    res.status(200).json({
      success: true,
      message: 'order retrieved successfully.',
      data: order,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
