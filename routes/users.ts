import { Router } from 'express';
import validateBody from '../middlewares/validateBody';
import authAdmin from '../middlewares/authAdmin';
import { loginSchema, updateUserSchema, userSchema } from '../utils/joi';
import createUser from '../controllers/users/createUser';
import signin from '../controllers/users/signin';
import getAllUsers from '../controllers/users/getAllUsers';
import updateUser from '../controllers/users/updateUser';

const router = Router();

router.get('/', authAdmin, getAllUsers);
router.post('/', authAdmin, validateBody(userSchema), createUser);
router.post('/login', validateBody(loginSchema), signin);
router.put('/:id', authAdmin, validateBody(updateUserSchema), updateUser);

export default router;
