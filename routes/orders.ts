import { Router } from 'express';
import authentication from '../middlewares/authentication';
import createOrder from '../controllers/orders/createOrder';
import validateBody from '../middlewares/validateBody';
import { createOrderSchema } from '../utils/joi';
import authAdmin from '../middlewares/authAdmin';
import getAllOrders from '../controllers/orders/getAllOrders';

const router = Router();

router.get('/', authAdmin, getAllOrders);
router.post('/', authentication, validateBody(createOrderSchema), createOrder);

export default router;
