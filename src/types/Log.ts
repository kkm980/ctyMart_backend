// src/types/Logs
import mongoose, { Document } from 'mongoose';
import { UserAction } from './UserAction';
import { ActionTakers } from './ActionTakers';

// Logs interface
export interface ILog extends Document {
    user: mongoose.Types.ObjectId;
    userAs: ActionTakers;
    actionType: UserAction;
    comment?: string;
    subject?: any;
}