// src/types/Category
import mongoose, { Document } from 'mongoose';

// Category interface
export interface ICategory extends Document {
    name: string;
    description?: string;
    parentCategory?: mongoose.Types.ObjectId;
    rating: number;
    totalOrders: number;
    isTopPerformer: boolean;
    images?: string[];
    isDeleted: boolean;
    isBanned: Date | null;
}