import { Router } from 'express';
import getCurrency from '../controllers/utils/getCurrency';

const router = Router();

router.get('/currency', getCurrency);

export default router;
