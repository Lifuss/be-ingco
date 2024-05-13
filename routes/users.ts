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
const router = Router();
// TODO: Add route that allow admit edit user password

router.get('/', authAdmin, getAllUsers);
router.get('/refresh', authentication, refreshUser);

router.post('/', authAdmin, validateBody(userSchema), createUser);
router.post('/register', validateBody(registerUserSchema), signup);
router.post('/login', validateBody(loginSchema), signin);

router.put('/:id', authAdmin, validateBody(updateUserSchema), updateUser);

router.delete('/logout', authentication, signout);

export default router;
