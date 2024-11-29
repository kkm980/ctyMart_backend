import { createProduct, updateProduct } from "../controller";
import { Router } from 'express';

const productRouter = Router();
productRouter.post('/create', createProduct);
productRouter.put('/update/:id', updateProduct);

export default productRouter;