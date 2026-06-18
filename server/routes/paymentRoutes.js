import express from 'express';
import {
  createStripePaymentIntent,
  stripeWebhook,
  createPayPalOrder,
  capturePayPalPayment,
  getStripePublishableKey
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Stripe Payment Intent & Configurations
router.post('/stripe/create-intent', protect, createStripePaymentIntent);
router.get('/config/stripe', protect, getStripePublishableKey);

// PayPal Endpoints
router.post('/paypal/create-order', protect, createPayPalOrder);
router.post('/paypal/capture/:orderId', protect, capturePayPalPayment);

// Webhooks (Must be Public and receive raw payloads for Stripe signatures verification)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
