// src/tils/isValidObjectId.ts
import mongoose from "mongoose";

// Validation function for ObjectId
export const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);
