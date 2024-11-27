// src/types/Review
import mongoose, { Document } from 'mongoose';
import { RatingPointer } from './RatingPointer';
import { UserFinds } from './UserFinds';

// Review interface
export interface IReview extends Document {
    customer: mongoose.Types.ObjectId;
    order: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    store: mongoose.Types.ObjectId;
    description?: string;
    rating: RatingPointer;
    userFinds: UserFinds;
    isDeleted: boolean;
}