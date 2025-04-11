import { Router } from 'express';
import authentication from '../middlewares/authentication';
import createOrder from '../controllers/orders/createOrder';
import validateBody from '../middlewares/validateBody';
import { createOrderRetailSchema, createOrderSchema, updateOrderSchema } from '../utils/joi';
import authAdmin from '../middlewares/authAdmin';
import getAllOrders from '../controllers/orders/getAllOrders';
import updateOrder from '../controllers/orders/updateOrder';
import getUserOrders from '../controllers/orders/getUserOrders';
import createOrderRetail from '../controllers/orders/retail/createOrderRetail';
import updateRetailOrder from '../controllers/orders/retail/updateOrderRetail';
import getOrderSheet from '../controllers/products/sheet/getOrderSheet';

const router = Router();

router.get('/', authentication, getUserOrders);
// TODO: refactor for sort and select
router.get('/all', authAdmin, getAllOrders);
router.get('/sheets/:id', authAdmin, getOrderSheet);

router.post('/', authentication, validateBody(createOrderSchema), createOrder);
router.post('/retail', validateBody(createOrderRetailSchema), createOrderRetail);

router.put('/retail/:id', authAdmin, validateBody(updateOrderSchema), updateRetailOrder);
router.put('/:id', authAdmin, validateBody(updateOrderSchema), updateOrder);

export default router;
