import { Router } from 'express';
import createProduct from '../controllers/products/createProduct';
import validateBody from '../middlewares/validateBody';
import { productSchema } from '../utils/joi';
import getAllProducts from '../controllers/products/getAllProducts';
import getById from '../controllers/products/getById';

const router = Router();

router.get('/', getAllProducts);
router.post('/', validateBody(productSchema), createProduct);
router.get('/:id', getById);

export default router;
