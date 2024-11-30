import { createOrder, getAllOrders, updateOrder } from "../controller";
import { Router } from 'express';
const orderRouter = Router();
orderRouter.post('/create', createOrder);
orderRouter.get('/', getAllOrders);
orderRouter.put('/update/:id', updateOrder);
export default orderRouter;