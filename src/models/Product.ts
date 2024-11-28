// src/models/Product.ts

import { MeasureType } from 'constants/enums';
import mongoose, { Model, Schema } from 'mongoose';
import { IProduct, IProductModel } from 'types';

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
        enum: Object.values(MeasureType),
        required: true,
        message: "catch:required field:measuringUnit",
    },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    availableQuantity: { type: Number, required: true, default: 500 },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isTopPerformer: { type: Boolean, default: false },
    images: [{ type: String }],
    notifyTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isDeleted: { type: Boolean, default: false },
    isBanned: { type: Date, default: null }
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

// on addition/update on any product, update the minimum price, maximum price of store 
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


// Static method on ProductSchema
// Add the static method
productSchema.statics.incrementTotalOrders = async function (productId: string, quantity: number): Promise<void> {
    try {
        // Find the product to get its associated storeId
        const product = await this.findById(productId).select('storeId');
        if (!product) {
            throw new Error(`Product with ID ${productId} not found.`);
        }

        // Increment the totalOrders count for the store
        const storeId = product.storeId;
        await mongoose.model('Store').findByIdAndUpdate(storeId, {
            $inc: { totalOrders: quantity },
        });

        // Increment the totalOrders count for the product
        await this.findByIdAndUpdate(productId, {
            $inc: { totalOrders: quantity },
        });

        console.log(`Successfully updated totalOrders for product ${productId} and store ${storeId}.`);
    } catch (error) {
        console.error(`Failed to update totalOrders for product ${productId}:`, error);
    }
};


// Create and export the Product model
export const Product = mongoose.model<IProduct, IProductModel>('Product', productSchema);
