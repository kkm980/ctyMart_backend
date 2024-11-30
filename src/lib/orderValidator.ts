import { IOrder } from '../types';
import { OrderStatus, OrderType, ActionTakers, Arrived } from '../constants/enums';

export const validateCustomer = (customerId: string) => {
  if (!customerId || typeof customerId !== 'string') {
    return { isValid: false, error: 'Valid customer ID is required' };
  }
  return { isValid: true };
};

export const validateItems = (items: IOrder['items']) => {
  if (!Array.isArray(items) || (!items?.length)) {
    return { isValid: false, error: 'At least one item is required' };
  }

  for (const item of items) {
    if (!item.product || !item.quantity || item.quantity < 1) {
      return { isValid: false, error: 'Each item must have a valid product ID and quantity' };
    }
  }
  return { isValid: true };
};

export const validateDeliveryLocation = (deliverAt: IOrder['deliverAt']) => {
  if (!deliverAt || !deliverAt.address || !deliverAt.location) {
    return { isValid: false, error: 'Delivery address and location are required' };
  }

  const [longitude, latitude] = deliverAt.location;
  if (
    !Array.isArray(deliverAt.location) ||
    deliverAt.location.length !== 2 ||
    longitude < -180 || longitude > 180 ||
    latitude < -90 || latitude > 90
  ) {
    return { isValid: false, error: 'Invalid location coordinates' };
  }

  return { isValid: true };
};

export const validateOrderStatus = (status: string) => {
  if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
    return { isValid: false, error: 'Invalid order status' };
  }
  return { isValid: true };
};

export const validateOrderType = (orderType: string) => {
    console.log('OrderType Enum Values:', Object.values(OrderType));
    console.log('Received OrderType:', orderType);
  
    if (!Object.values(OrderType).includes(orderType as OrderType)) {
      return { isValid: false, error: 'Invalid order type' };
    }
    return { isValid: true };
  };
  