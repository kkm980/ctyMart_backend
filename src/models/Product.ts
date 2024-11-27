// src/models/Product.ts

import mongoose, { Model, Schema } from 'mongoose';
import { IProduct } from 'types';

// Product schema
const productSchema = new Schema<IProduct>({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
        validate: {
            validator: (id: any) => mongoose.isValidObjectId(id),
            message: 'Invalid storeId',
        },
    },
    name: { type: String, required: true, message: "catch:required field:name" },
    description: { type: String },
    price: { type: Number, required: true, message: "catch:required field:price" },
    measuringUnit: {
        type: String,
        enum: ['kg', 'g', 'l', 'ml', 'pcs', 'pack'],
        required: true,
        message: "catch:required field:measuringUnit",
    },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    availableQuantity: { type: Number, required: true, default: 500 },
    isAvailable: { type: Boolean, default: true },
    metrics: {
        rating: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },
        isTopPerformer: { type: Boolean, default: false },
    },
    images: [{ type: String }],
}, {
    timestamps: true,
});

productSchema.index({ name: 'text' }); // Text Index: StoreId and Name (Compound Index)
productSchema.index({ storeId:1, categories: 1 }); // Regular index on categories

// Middleware to automatically update `isAvailable` based on `availableQuantity`
productSchema.pre<IProduct>('save', function (next) {
    if (this.availableQuantity === 0) {
        this.isAvailable = false;
    }
    next();
});

productSchema.pre('save', async function (next) {
    try {
        const Store = mongoose.model('Store');
        const store = await Store.findById(this.storeId);
        if (store) {
            await store.updatePriceMetrics(); // Update store metrics before saving the product
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-DeleteOne Middleware: Update Store Metrics
productSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const Store = mongoose.model('Store');
        const store = await Store.findById(this.storeId);
        if (store) {
            await store.updatePriceMetrics();
        }
        next();
    } catch (error) {
        next(error);
    }
});


// Custom method to manually update `isAvailable`
productSchema.methods.updateAvailability = async function (isAvailable: boolean): Promise<IProduct> {
    this.isAvailable = isAvailable;
    return this.save();
};

// Create and export the Product model
export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
