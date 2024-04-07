import { Router } from 'express';
import validateBody from '../middlewares/validateBody';
import authAdmin from '../middlewares/authAdmin';
import { userSchema } from '../utils/joi';

const router = Router();

router.post('/', authAdmin, validateBody(userSchema), createUser);

export default router;
