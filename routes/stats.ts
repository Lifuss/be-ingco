import { Router } from 'express';
import productClicks from '../controllers/stats/productClicks';
import getProductClicks from '../controllers/stats/getProductClicks';
import authAdmin from '../middlewares/authAdmin';
import getUserActivityStats from '../controllers/stats/getUserActivityStats';

const router = Router();

router.get('/users/activity', authAdmin, getUserActivityStats);

router.get('/products/clicks', authAdmin, getProductClicks);
router.get('/products/:productId', productClicks);

export default router;
