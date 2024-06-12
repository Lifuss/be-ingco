import { Router } from 'express';
import validateBody from '../middlewares/validateBody';
import authAdmin from '../middlewares/authAdmin';
import {
  loginSchema,
  registerUserSchema,
  updateUserSchema,
  userSchema,
} from '../utils/joi';
import createUser from '../controllers/users/createUser';
import signin from '../controllers/users/signin';
import getAllUsers from '../controllers/users/getAllUsers';
import updateUser from '../controllers/users/updateUser';
import signup from '../controllers/users/signup';
import authentication from '../middlewares/authentication';
import signout from '../controllers/users/signout';
import refreshUser from '../controllers/users/refreshUser';
import addFavorites from '../controllers/users/favorites/addFavorites';
import addProductToCart from '../controllers/users/cart/addProductToCart';
import getCart from '../controllers/users/cart/getCart';
import deleteProductFromCart from '../controllers/users/cart/deleteProductFromCart';
import deleteFavorites from '../controllers/users/favorites/deleteFavorites';
import {
  getRetailCart,
  addProductToRetailCart,
  deleteProductFromRetailCart,
} from '../controllers/users/cart/retail';

const router = Router();
// TODO: Add route that allow admin edit user password

router.get('/', authAdmin, getAllUsers);
router.get('/refresh', authentication, refreshUser);
router.get('/cart', authentication, getCart);
router.get('/cart/retail', authentication, getRetailCart);

router.post('/', authAdmin, validateBody(userSchema), createUser);
router.post('/register', validateBody(registerUserSchema), signup);
router.post('/login', validateBody(loginSchema), signin);
router.post('/cart', authentication, addProductToCart);
router.post('/cart/retail', authentication, addProductToRetailCart);
router.post('/favorites/:productId', authentication, addFavorites);

router.put('/:id', authAdmin, validateBody(updateUserSchema), updateUser);

router.delete('/logout', authentication, signout);
router.delete('/cart', authentication, deleteProductFromCart);
router.delete('/cart/retail', authentication, deleteProductFromRetailCart);
router.delete('/favorites/:productId', authentication, deleteFavorites);

export default router;
