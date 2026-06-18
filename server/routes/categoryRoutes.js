import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, admin, createCategory);

export default router;
