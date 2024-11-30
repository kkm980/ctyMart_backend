import { Request, Response } from 'express';
import { Order, Product } from '../../models';
import {
  validateCustomer,
  validateItems,
  validateDeliveryLocation,
  validateOrderType,
} from '../../lib/orderValidator';
import { validateObjectId } from '../../lib/commonValidator';
import mongoose from 'mongoose';
import { OrderStatus, OrderType } from '../../constants/enums';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  res.status(statusCode).json({ success: false, error: error.message || error });
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customer,
      description,
      items,
      orderType = OrderType.Postpaid,
      deliverAt,
    } = req.body;

    // Validate customer
    const customerValidation = validateCustomer(customer);
    if (!customerValidation.isValid) {
      return errorResponse(res, customerValidation.error);
    }

    // Validate customer ObjectId
    const customerIdValidation = validateObjectId(customer, 'Customer ID');
    if (!customerIdValidation.isValid) {
      return errorResponse(res, customerIdValidation.error);
    }

    // Validate items
    const itemsValidation = validateItems(items);
    if (!itemsValidation.isValid) {
      return errorResponse(res, itemsValidation.error);
    }

    // Validate delivery location
    const deliveryValidation = validateDeliveryLocation(deliverAt);
    if (!deliveryValidation.isValid) {
      return errorResponse(res, deliveryValidation.error);
    }

    // Validate order type
    const orderTypeValidation = validateOrderType(orderType);
    if (!orderTypeValidation.isValid) {
      return errorResponse(res, orderTypeValidation.error);
    }

    // Calculate total price and validate products
    let totalPrice = 0;
    for (const item of items) {
        console.log(item.product, "here product")
      const product = await Product.findById(item.product).session(session);
      if (!product || product.isDeleted) {
        return errorResponse(res, `Product ${item.product} not found or has been deleted`);
      }
      if (!product.isAvailable || product.availableQuantity < item.quantity) {
        return errorResponse(res, `Product ${product.name} is not available in requested quantity`);
      }
      totalPrice += product.price * item.quantity;
    }

    const newOrder = await Order.create([{
      customer,
      description,
      status: OrderStatus.Pending,
      orderType,
      items,
      totalPrice,
      deliverAt
    }], { session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder[0]
    });
  } catch (error) {
    await session.abortTransaction();
    return errorResponse(res, error);
  } finally {
    session.endSession();
  }
};