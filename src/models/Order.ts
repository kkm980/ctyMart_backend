import { ActionTakers, Arrived, OrderStatus, OrderType, PaymentStatus } from '../constants/enums';
import mongoose, { Schema } from 'mongoose';
import { IOrder } from 'types';
import { Product } from './Product';

// Order Schema
const OrderSchema = new Schema<IOrder>({
    customer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to a User model (customer)
    description: { type: String, required: false },
    status: {
        type: String,
        enum: Object.values(OrderStatus),  // Use Object.values to extract enum values
        required: true,
        default: OrderStatus.Pending  // Ensure the default matches one of the enum values
    },
    orderType: {
        type: String,
        enum: Object.values(OrderType),  // Use Object.values to extract enum values
        required: true,
        default: OrderType.Postpaid  // Ensure the default matches one of the enum values
    },
    updateHistory: [
        {
            updatedBy: {
                type: String,
                enum: Object.values(ActionTakers),
                required: true
            },
            status: {
                type: String,
                enum: [...Object.values(OrderStatus), ...Object.values(PaymentStatus)], // Concatenate enums properly
                required: true
            }
        }
    ],
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }, // Reference to Product model
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    totalPrice: { type: Number, required: true, min: 0 },
    arrivingIn: {type: String, required: false},
    arrived: { type: String,
               enum: Object.values(Arrived),
               required: false
            },
    deliverAt: {
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        location: {
            type: [Number],
            required: [true, 'Location is required'],
            validate: {
                validator: (value: [number, number]) => {
                    return (
                        Array.isArray(value) &&
                        value.length === 2 &&
                        value[0] >= -180 && value[0] <= 180 && // Longitude between -180 and 180
                        value[1] >= -90 && value[1] <= 90 // Latitude between -90 and 90
                    );
                },
                message: 'Invalid location. Coordinates must be [longitude, latitude].',
            },
        },
    },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

OrderSchema.index({ customer: 1 }); // Index for customer field
OrderSchema.index({ 'items.product': 1 }); // Index for product references
OrderSchema.index({ status: 1, orderType: 1 }); // Compound index for queries involving status and type


// Middleware to update totalOrders count of Product when an order is delivered
OrderSchema.post('findOneAndUpdate', async function (doc: any) {
    if (doc?.status === 'delivered') {
        const items = doc.items;

        if (items && Array.isArray(items)) {
            for (const item of items) {
                const productId = item.product;
                const quantity = item.quantity;

                // Call the static method on the Product model
                try {
                    await Product.incrementTotalOrders(productId, quantity);
                } catch (error) {
                    console.error('Error updating total orders:', error);
                }
            }
        }
    }
});

// Create and export the model
export const Order = mongoose.model<IOrder>('Order', OrderSchema);
