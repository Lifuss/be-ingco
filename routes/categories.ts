import { Router } from 'express';
import getAllCategories from '../controllers/categories/getAllCategories';
import createCategory from '../controllers/categories/createCategory';
import validateBody from '../middlewares/validateBody';
import { categorySchema } from '../utils/joi';
import updateCategory from '../controllers/categories/updateCategory';
import deleteCategory from '../controllers/categories/deleteCategory';

const router = Router();

router.get('/', getAllCategories);
router.post('/', validateBody(categorySchema), createCategory);
router.put('/:id', validateBody(categorySchema), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
