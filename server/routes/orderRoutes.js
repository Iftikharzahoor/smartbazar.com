import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  cancelOrder,
  getOrders,
  updateOrderStatus,
  updateOrderToDelivered,
  getOrderSummary
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Private Order Endpoints
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin Analytics Summary must be defined BEFORE generic /:id route parameters
router.get('/stats/summary', protect, admin, getOrderSummary);

router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);

// Admin Restricted Order Management Endpoints
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

export default router;
