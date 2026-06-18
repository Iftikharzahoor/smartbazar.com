import express from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload, uploadImages } from '../middleware/upload.js';

const router = express.Router();

// Public Product Catalog Endpoints
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/related/:id', getRelatedProducts);
router.get('/:id', getProductById);

// Private Product Review Endpoint
router.post('/:id/reviews', protect, createProductReview);

// Admin Restricted Product Management Endpoints (Supports up to 8 uploaded images)
router.post(
  '/',
  protect,
  admin,
  upload.array('images', 8),
  uploadImages,
  createProduct
);

router.put(
  '/:id',
  protect,
  admin,
  upload.array('images', 8),
  uploadImages,
  updateProduct
);

router.delete('/:id', protect, admin, deleteProduct);

export default router;
