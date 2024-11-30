import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../../models/Order';
import {
  validateObjectId,
//   validateOrderStatus,
//   validateOrderItems,
//   validateDeliverAt,
} from '../../lib/commonValidator';
import { ActionTakers, Arrived, OrderStatus, OrderType } from '../../constants/enums';
import { validateDeliveryLocation, validateOrderStatus, validateOrderType } from '../../lib/orderValidator';

// Utility function for error responses
const errorResponse = (res: Response, error: any, statusCode = 400) => {
  res.status(statusCode).json({ success: false, error: error.message || error });
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { id } = req.params;
      const {
        orderType,
        status,
        description,
        deliverAt,
        arrivingIn,
        arrived,
        isDeleted,
        updatedBy,
      } = req.body;
  
      // Validate Order ID
      const orderIdValidation = validateObjectId(id, 'Order ID');
      if (!orderIdValidation.isValid) {
        return errorResponse(res, orderIdValidation.error);
      }
  
      const existingOrder = await Order.findById(id).session(session);
      if (!existingOrder) {
        return errorResponse(res, 'Order not found or has been deleted', 404);
      }
  
      const updateData: any = {};
  
      // Update status and add to updateHistory
      if (status !== undefined) {
        const statusValidation = validateOrderStatus(status);
        if (!statusValidation.isValid) {
          return errorResponse(res, statusValidation.error);
        }
        updateData.status = status;
  
        // Validate updatedBy
        if (!updatedBy || !Object.values(ActionTakers).includes(updatedBy as ActionTakers)) {
          return errorResponse(res, 'Valid updatedBy value is required for status change');
        }
  
        // Add to updateHistory
        await Order.updateOne(
          { _id: id },
          {
            $push: {
              updateHistory: {
                updatedBy,
                status,
              },
            },
          },
          { session }
        );
      }
            // Update order type
            if (orderType !== undefined) {
                const orderTypeValidation = validateOrderType(orderType);
                if (!orderTypeValidation.isValid) {
                  return errorResponse(res, orderTypeValidation.error);
                }
                updateData.orderType = orderType;
          
                // Validate updatedBy
                if (!updatedBy || !Object.values(ActionTakers).includes(updatedBy as ActionTakers)) {
                  return errorResponse(res, 'Valid updatedBy value is required for status change');
                }
              }
  
      // Update other fields
      if (description !== undefined) {
        updateData.description = description;
      }
  
      if (deliverAt !== undefined) {
        const deliveryValidation = validateDeliveryLocation(deliverAt);
        if (!deliveryValidation.isValid) {
          return errorResponse(res, deliveryValidation.error);
        }
        updateData['deliverAt.address'] = deliverAt.address;
        updateData['deliverAt.location'] = deliverAt.location;
      }
  
      if (arrivingIn !== undefined) {
        updateData.arrivingIn = arrivingIn;
      }
  
      if (arrived !== undefined) {
        if (!Object.values(Arrived).includes(arrived as Arrived)) {
          return errorResponse(res, 'Invalid arrived status');
        }
        updateData.arrived = arrived;
      }
  
      if (isDeleted !== undefined) {
        updateData.isDeleted = isDeleted;
      }
  
      if (Object.keys(updateData).length === 0) {
        return errorResponse(res, 'No valid update data provided');
      }
  
      // Update the document
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true, session }
      );
  
      await session.commitTransaction();
  
      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder,
      });
    } catch (error) {
      await session.abortTransaction();
      return errorResponse(res, error);
    } finally {
      session.endSession();
    }
  };
  
