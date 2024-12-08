import { Request, Response } from 'express';
import { Product } from '../../models';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, error: error.message || error });
};

// Controller to get all products based on filters
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

    // Find products with required conditions
    const products = await Product.find({
      ...filters,
      $and: [
        { $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }] },
        {
          $or: [
            { isBanned: { $exists: false } },
            { isBanned: null },
            { isBanned: { $type: 'date' } }, // Check for valid Date values
          ],
        },
      ],
    })
      .populate({
        path: 'storeId',
        match: {
          $and: [
            { $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }] },
            {
              $or: [
                { isBanned: { $exists: false } },
                { isBanned: null },
                { isBanned: { $type: 'date' } }, // Check for valid Date values
              ],
            },
          ],
        },
        select: '-__v', // Optionally exclude fields like __v
      });

    // Filter out products where the store is null (didn't match store conditions)
    const filteredProducts = products.filter((product) => product.storeId);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully.',
      data: filteredProducts,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

