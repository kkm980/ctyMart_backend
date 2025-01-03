// src/types/Store
import mongoose, { Document } from 'mongoose';

// Store interface
export interface IStore extends Document {
    name: string;
    description?: string;
    address: string;
    location: [number, number];
    owner: mongoose.Types.ObjectId;
    managers?: mongoose.Types.ObjectId[];
    contact: string[];
    categories?: mongoose.Types.ObjectId[];
    isOpen: boolean;
    operatingHours : {
        monday: { open: string; close: string };
        tuesday: { open: string; close: string };
        wednesday: { open: string; close: string };
        thursday: { open: string; close: string };
        friday: { open: string; close: string };
        saturday: { open: string; close: string };
        sunday: { open: string; close: string };
    };
    rating: number;
    totalReviews: number;
    totalOrders: number;
    isTopPerformer: boolean;
    minProductPrice: number;
    maxProductPrice: number;
    isCertified: null | Date;
    notifyTo?: mongoose.Types.ObjectId[];
    images: string[];
    isDeleted: boolean;
    isBanned: Date | null;
    updatePriceMetrics(): Promise<void>;
}