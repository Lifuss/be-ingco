import { Router } from 'express';
import authentication from '../middlewares/authentication';

const router = Router();

router.post('/', authentication, createOrder);

export default router;
