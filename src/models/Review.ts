// src/models/Review.ts

import { RatingPointer, UserFinds } from 'constants/enums';
import mongoose, { Schema } from 'mongoose';
import { IReview } from 'types';


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

// Export the model
export default mongoose.model<IReview>('Review', ReviewSchema);
  