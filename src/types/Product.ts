// src/types/Product
import mongoose, { Document, Model } from 'mongoose';
import { MeasureTypes } from './MeasureTypes';

// Product interface
export interface IProduct extends Document {
    storeId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    measuringUnit: MeasureTypes;
    categories?: mongoose.Types.ObjectId[];
    availableQuantity: number;
    isAvailable: boolean;
    rating: number;
    totalOrders: number;
    isTopPerformer: boolean;
    images: string[];
    isDeleted: boolean;
    isBanned: Date | null;
    updateAvailability(isAvailable: boolean): Promise<IProduct>;
}

// Product Model Interface (Static Methods)
export interface IProductModel extends Model<IProduct> {
    incrementTotalOrders(productId: string, quantity: number): Promise<void>;
}