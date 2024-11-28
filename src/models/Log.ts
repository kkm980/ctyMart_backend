// src/models/Log.ts
import { ActionTakers, UserAction } from 'constants/enums';
import { Schema, model } from 'mongoose';
import { ILog } from 'types';

// Logs schema
const LogSchema = new Schema<ILog>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Assuming 'User' is the model name for your user collection
            required: true,
        },
        userAs: {
            type: String,
            enum: Object.values(ActionTakers),
            required: true,
        },
        actionType: {
            type: String,
            enum: Object.values(UserAction),
            required: true,
        },
        comment: {
            type: String,
        },
        subject: {
            type: Schema.Types.Mixed, // Generic field for any type of subject
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

export const Log = model<ILog>('Log', LogSchema);
