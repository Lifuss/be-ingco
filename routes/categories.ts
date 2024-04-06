import { Router } from 'express';
import getAllCategories from '../controllers/categories/getAllCategories';
import createCategory from '../controllers/categories/createCategory';
import validateBody from '../middlewares/validateBody';
import { categorySchema } from '../utils/joi';
import updateCategory from '../controllers/categories/updateCategory';

const router = Router();

router.get('/', getAllCategories);
router.post('/', validateBody(categorySchema), createCategory);
router.put('/:id', validateBody(categorySchema), updateCategory);

export default router;
