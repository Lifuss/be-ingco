import { Router } from 'express';
import createProduct from '../controllers/products/createProduct';
import validateBody from '../middlewares/validateBody';
import { productSchema, updateProductSchema } from '../utils/joi';
import getAllProducts from '../controllers/products/getAllProducts';
import getById from '../controllers/products/getById';
import updateProduct from '../controllers/products/updateProduct';

const router = Router();

router.get('/', getAllProducts);
router.post('/', validateBody(productSchema), createProduct);
router.put('/:id', validateBody(updateProductSchema), updateProduct);
router.get('/:id', getById);

export default router;
