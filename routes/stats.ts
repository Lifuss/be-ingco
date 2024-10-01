import { Router } from 'express';
import productClicks from '../controllers/stats/productClicks';

const router = Router();

router.get('/products/:productId', productClicks);

export default router;
