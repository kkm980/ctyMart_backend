// src/types/Product
import mongoose, { Document } from 'mongoose';

// Product interface
export interface IProduct extends Document {
    storeId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    measuringUnit: 'kg' | 'g' | 'l' | 'ml' | 'pcs' | 'pack';
    categories?: mongoose.Types.ObjectId[];
    availableQuantity: number;
    isAvailable: boolean;
    metrics: {
        rating: number;
        totalOrders: number;
        isTopPerformer: boolean;
    };
    images: string[];
    updateAvailability(isAvailable: boolean): Promise<IProduct>;
}