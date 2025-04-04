import { Router } from 'express';
import validateBody from '../middlewares/validateBody';
import authAdmin from '../middlewares/authAdmin';
import {
  forgotSchema,
  loginSchema,
  registerUserClientSchema,
  registerUserSchema,
  resetPasswordSchema,
  supportSchema,
  updateUserSchema,
  userSchema,
} from '../utils/joi';
import createUser from '../controllers/users/createUser';
import signin from '../controllers/users/auth/signin';
import getAllUsers from '../controllers/users/getAllUsers';
import updateUser from '../controllers/users/updateUser';
import signup from '../controllers/users/auth/signup';
import authentication from '../middlewares/authentication';
import signout from '../controllers/users/auth/signout';
import refreshUser from '../controllers/users/auth/refreshUser';
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
import deleteUser from '../controllers/users/deleteUser';
import clientSignup from '../controllers/users/auth/clientSignup';
import usersStats from '../controllers/users/usersStats';
import forgot from '../controllers/users/auth/forgot';
import resetPassword from '../controllers/users/auth/resetPassword';
import createSupportTicket from '../controllers/users/support/createSupportTicket';
import getAllSupportTickets from '../controllers/users/support/getAllSupportTickets';
import updateSupportTicket from '../controllers/users/support/updateSupportTickets';
import restoreUser from '../controllers/users/restoreUser';

const router = Router();

router.get('/', authAdmin, getAllUsers);
router.get('/stats', authAdmin, usersStats);
router.get('/refresh', authentication, refreshUser);
router.get('/cart', authentication, getCart);
router.get('/cart/retail', authentication, getRetailCart);
router.get('/support', authAdmin, getAllSupportTickets);

router.post('/', authAdmin, validateBody(userSchema), createUser);
router.post('/support', validateBody(supportSchema), createSupportTicket);
router.post('/register', validateBody(registerUserSchema), signup);
router.post(
  '/register/client',
  validateBody(registerUserClientSchema),
  clientSignup,
);
router.post('/login', validateBody(loginSchema), signin);
router.post('/forgot', validateBody(forgotSchema), forgot);
router.post('/resetPassword', validateBody(resetPasswordSchema), resetPassword);
router.post('/cart', authentication, addProductToCart);
router.post('/cart/retail', authentication, addProductToRetailCart);
router.post('/favorites/:productId', authentication, addFavorites);
router.post('/restore/:id', authAdmin, restoreUser);

router.put('/:id', authAdmin, validateBody(updateUserSchema), updateUser);

router.patch('/support/:ticketId', authAdmin, updateSupportTicket);

router.delete('/logout', authentication, signout);
router.delete('/cart', authentication, deleteProductFromCart);
router.delete('/cart/retail', authentication, deleteProductFromRetailCart);
router.delete('/favorites/:productId', authentication, deleteFavorites);
router.delete('/:id', authAdmin, deleteUser);

export default router;
