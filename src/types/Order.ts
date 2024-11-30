// src/types/Order
import mongoose, { Document } from 'mongoose';
import { OrderStatus } from './OrderStatus';
import { PaymentStatus } from './PaymentStatus';
import { OrderType } from './OrderType';
import { TimeStatus } from './TimeStatus';
import { ActionTakers } from './ActionTakers';

// Order interface
export interface IOrder extends Document {
    customer: mongoose.Types.ObjectId;
    description?: string;
    status: OrderStatus;
    orderType: OrderType;
    updateHistory: Array<{
        updatedBy: ActionTakers;
        status: OrderStatus | PaymentStatus;
    }>;
    items: [{ product: mongoose.Types.ObjectId, quantity: number }];
    totalPrice: number;
    arrivingIn?: string; // total predicted time to arrive
    arrived?: TimeStatus; // was order late or not
    deliverAt: {
        address: string;
        location: [number, number];
    };
    isDeleted: boolean;
}