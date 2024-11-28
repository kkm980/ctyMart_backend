// src/models/Store.ts

import mongoose, { Model, Schema } from 'mongoose';
import { IStore } from 'types';

// Store schema
const storeSchema = new Schema<IStore>({
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    location: {
        type: [Number], // Array of two numbers [latitude, longitude]
        required: true,
        validate: {
            validator: (value: [number, number]) => {
                if (!Array.isArray(value) || value.length !== 2) return false;
                const [latitude, longitude] = value;
                return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
            },
            message: 'catch:invalid field:location',
        },
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    managers: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    contact: [{ type: String, required: true }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    isOpen: { type: Boolean, default: true },
    operatingHours: {
        monday: { open: { type: String, required: true }, close: { type: String, required: true } },
        tuesday: { open: { type: String, required: true }, close: { type: String, required: true } },
        wednesday: { open: { type: String, required: true }, close: { type: String, required: true } },
        thursday: { open: { type: String, required: true }, close: { type: String, required: true } },
        friday: { open: { type: String, required: true }, close: { type: String, required: true } },
        saturday: { open: { type: String, required: true }, close: { type: String, required: true } },
        sunday: { open: { type: String, required: true }, close: { type: String, required: true } },
    },
    rating: { type: Number, default: 0 },
    totalReviews: {type: Number, default: 0},
    totalOrders: { type: Number, default: 0 },
    isTopPerformer: { type: Boolean, default: false },
    minProductPrice: { type: Number, required: true, default: 0 },
    maxProductPrice: { type: Number, required: true, default: 0 },
    isCertified:{
        type: Date,    // This field will store the date when the user became premium
        default: null, // Default value is null (not premium yet)
    },
    notifyTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    images: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
    isBanned: { type: Date, default: null }
}, {
    timestamps: true,
});

storeSchema.index({ address: 'text', name: 'text', owner: 'text', managers: 'text' }); // Text index on address and name
storeSchema.index({ categories: 1 }); // Regular index on categories

// Store Method: Update Price Metrics
storeSchema.methods.updatePriceMetrics = async function (): Promise<void> {
    const Product = mongoose.model('Product'); // Reference the Product model
    const products = await Product.find({ storeId: this._id }).select('price'); // Fetch products of this store

    if (products.length > 0) {
        const prices = products.map((product) => product.price);
        this.minProductPrice = Math.min(...prices);
        this.maxProductPrice = Math.max(...prices);
    } else {
        // No products, reset min and max prices
        this.minProductPrice = 0;
        this.maxProductPrice = 0;
    }

    await this.save();
};

// Create and export the Store model
export const Store: Model<IStore> = mongoose.model<IStore>('Store', storeSchema);