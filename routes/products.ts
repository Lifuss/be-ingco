import { Router } from 'express';
import createProduct from '../controllers/products/createProduct';
import validateBody from '../middlewares/validateBody';
import { productSchema, updateProductSchema } from '../utils/joi';
import getAllProducts from '../controllers/products/getAllProducts';
import getById from '../controllers/products/getById';
import updateProduct from '../controllers/products/updateProduct';
import deleteProduct from '../controllers/products/deleteProduct';

const router = Router();
// TODO: Add upload middleware

router.get('/', getAllProducts);
router.post('/', validateBody(productSchema), createProduct);
router.get('/:id', getById);
router.put('/:id', validateBody(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
