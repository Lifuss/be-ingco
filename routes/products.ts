import { Router } from 'express';
import createProduct from '../controllers/products/createProduct';
import validateBody from '../middlewares/validateBody';
import { productSchema } from '../utils/joi';

const router = Router();

router.post('/', validateBody(productSchema), createProduct);

export default router;
