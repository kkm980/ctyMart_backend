// src/types/Order
import mongoose, { Document } from 'mongoose';
import { OrderStatus } from './OrderStatus';
import { PaymentStatus } from './PaymentStatus';
import { OrderType } from './OrderType';

// Order interface
export interface IOrder extends Document {
    customer: mongoose.Types.ObjectId;
    description?: string;
    status: OrderStatus;
    orderType: OrderType;
    updateHistory: Array<{
        updatedBy: 'user' | 'admin' | 'store' | 'deliveryPartner';
        status: OrderStatus | PaymentStatus;
    }>;
    items: [{ product: mongoose.Types.ObjectId, qantity: Number }];
    totalPrice: Number;
    deliverAt: {
        address: string;
        location: [number, number];
    };
    isDeleted: boolean;
}