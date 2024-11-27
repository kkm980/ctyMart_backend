// src/types/Store
import mongoose, { Document } from 'mongoose';

// Store interface
export interface IStore extends Document {
    name: string;
    description?: string;
    address: string;
    location: [number, number];
    owners: mongoose.Types.ObjectId[];
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
    metrics: {
        rating: number;
        totalOrders: number;
        isTopPerformer: boolean;
        minProductPrice: number;
        maxProductPrice: number;
    };
    updatePriceMetrics(): Promise<void>;
    images: string[];
}