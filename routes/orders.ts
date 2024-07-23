import { Router } from 'express';
import authentication from '../middlewares/authentication';
import createOrder from '../controllers/orders/createOrder';
import validateBody from '../middlewares/validateBody';
import {
  createOrderRetailSchema,
  createOrderSchema,
  updateOrderSchema,
} from '../utils/joi';
import authAdmin from '../middlewares/authAdmin';
import getAllOrders from '../controllers/orders/getAllOrders';
import updateOrder from '../controllers/orders/updateOrder';
import getUserOrders from '../controllers/orders/getUserOrders';
import createOrderRetail from '../controllers/orders/retail/createOrderRetail';

const router = Router();

router.get('/', authentication, getUserOrders);
// TODO: refactor for sort and select
router.get('/all', authAdmin, getAllOrders);


router.post('/', authentication, validateBody(createOrderSchema), createOrder);
router.post(
  '/retail',
  validateBody(createOrderRetailSchema),
  createOrderRetail,
);

router.put('/:id', authAdmin, validateBody(updateOrderSchema), updateOrder);

export default router;
