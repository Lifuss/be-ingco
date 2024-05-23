import { Router } from 'express';
import authentication from '../middlewares/authentication';
import createOrder from '../controllers/orders/createOrder';
import validateBody from '../middlewares/validateBody';
import { createOrderSchema, updateOrderSchema } from '../utils/joi';
import authAdmin from '../middlewares/authAdmin';
import getAllOrders from '../controllers/orders/getAllOrders';
import updateOrder from '../controllers/orders/updateOrder';
import getUserOrders from '../controllers/orders/getUserOrders';

const router = Router();

router.get('/', authentication, getUserOrders);
router.get('/all', authAdmin, getAllOrders);

router.post('/', authentication, validateBody(createOrderSchema), createOrder);

router.patch('/:id', authAdmin, validateBody(updateOrderSchema), updateOrder);

export default router;
