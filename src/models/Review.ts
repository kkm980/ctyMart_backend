// src/models/Review.ts

import { RatingPointer, UserFinds } from 'constants/enums';
import mongoose, { Schema } from 'mongoose';
import { IReview } from 'types';
import { Product } from './Product';
import { Store } from './Store';

// Helper function to round to the nearest 0.5
const roundToNearestHalf = (num: number) => {
    return Math.round(num * 2) / 2;
};
// Review Schema
const ReviewSchema = new Schema<IReview>({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming the reference model for customer is 'User'
        required: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Assuming the reference model for order is 'Order'
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Assuming the reference model for product is 'Product'
        required: true,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store', // Assuming the reference model for store is 'Store'
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    rating:
    {
        type: String,
        enum: Object.values(RatingPointer),
        required: true,
        message: "catch:required field:RatingPointer",
    },
    userFinds: {
        type: String,
        enum: Object.values(UserFinds),
        required: true,
        message: "catch:required field:UserFinds",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Adding indexes
ReviewSchema.index({ product: 1 }); // Index for product
ReviewSchema.index({ customer: 1 }); // Index for customer
ReviewSchema.index({ order: 1 }); // Index for order

// Middleware to update totalReviews count of Product when an order is reviewed
//  on Product and Store document
ReviewSchema.post('save', async function () {
    try {
        const review = this;

        // Update totalReviews of the product
        const product = await Product.findById(review.product);
        const store = await Store.findById(review.store);

        if (product && store) {

            // Calculate new overall rating for product
            const currentProductRating = Number(product.rating);
            const totalProductReviews = product.totalReviews;
            const newProductRating = (currentProductRating * totalProductReviews + Number(review.rating)) / (totalProductReviews + 1);

            // Round to the nearest 0.5
            const roundedProductRating = roundToNearestHalf(newProductRating);

            // Update product's rating and totalReviews in one call
            await Product.findByIdAndUpdate(review.product, {
                $set: { rating: roundedProductRating },   // Set the new rating
                $inc: { totalReviews: 1 },                // Increment totalReviews by 1
            });

            // Calculate new overall rating for store (assuming the same logic applies to store)
            const currentStoreRating = Number(store.rating);
            const totalStoreReviews = store.totalReviews;
            const newStoreRating = (currentStoreRating * totalStoreReviews + Number(review.rating)) / (totalStoreReviews + 1);

            // Round to the nearest 0.5
            const roundedStoreRating = roundToNearestHalf(newStoreRating);

            // Update store's rating and totalReviews in one call
            await Store.findByIdAndUpdate(review.store, {
                $set: { rating: roundedStoreRating },   // Set the new rating
                $inc: { totalReviews: 1 },              // Increment totalReviews by 1
            });

        }
    } catch (error) {
        console.error('Error updating totalReviews and rating:', error);
    }
});

// Export the model
export default mongoose.model<IReview>('Review', ReviewSchema);
