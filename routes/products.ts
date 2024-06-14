import { Router } from 'express';
import createProduct from '../controllers/products/createProduct';
import validateBody from '../middlewares/validateBody';
import { productSchema, updateProductSchema } from '../utils/joi';
import getAllProducts from '../controllers/products/getAllProducts';
import getById from '../controllers/products/getById';
import updateProduct from '../controllers/products/updateProduct';
import deleteProduct from '../controllers/products/deleteProduct';
import upload from '../middlewares/upload';
import authAdmin from '../middlewares/authAdmin';
import authentication from '@/middlewares/authentication';
import getSheet from '@/controllers/products/sheet/getSheet';

const router = Router();

router.get('/', getAllProducts);
router.get('/sheets', authentication, getSheet);
router.get('/:id', getById);

router.post(
  '/',
  authAdmin,
  upload.single('image'),
  validateBody(productSchema),
  createProduct,
);

router.put(
  '/:id',
  authAdmin,
  upload.single('image'),
  validateBody(updateProductSchema),
  updateProduct,
);
router.delete('/:id', authAdmin, deleteProduct);

export default router;
