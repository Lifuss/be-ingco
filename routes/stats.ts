import { Router } from 'express';
import productClicks from '../controllers/stats/productClicks';
import getProductClicks from 'controllers/stats/getProductClicks';

const router = Router();

router.get('/products/clicks', getProductClicks);
router.get('/products/:productId', productClicks);

export default router;
