// src/models/Category.ts

import mongoose, { Model, Schema } from 'mongoose';
import { ICategory } from "types";

// Category schema
const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true, message: "catch:required field:name" },
    description: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    metrics: {
        rating: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },
        isTopPerformer: { type: Boolean, default: false },
    },
    isDeleted: { type: Boolean, default: false },
    isBanned: { type: Date, default: null }
}, {
    timestamps: true,
});

categorySchema.index({ name: 'text' }); // Text Index: name
categorySchema.index({ parentCategory: 1 }, { sparse: true }); // Text Index: parentCategory

// Create and export the Category model
export const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);
