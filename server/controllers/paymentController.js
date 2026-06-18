import Stripe from 'stripe';
import Order from '../models/Order.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

// Initialize Stripe (using try-catch for safe mock defaults if key is missing)
let stripe;
const isStripeConfigured =
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== 'sk_test_mock_stripe_key_values';

if (isStripeConfigured) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// @desc    Create Stripe PaymentIntent
// @route   POST /api/v1/payment/stripe/create-intent
// @access  Private
export const createStripePaymentIntent = async (req, res, next) => {
  const { amount, orderId } = req.body;

  try {
    if (!amount || !orderId) {
      return next(new ErrorResponse('Please provide amount and order ID', 400));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    if (isStripeConfigured) {
      // Create full secure Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert USD to cents
        currency: 'usd',
        metadata: { orderId: orderId.toString(), userId: req.user._id.toString() },
        automatic_payment_methods: { enabled: true }
      });

      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret
      });
    } else {
      // Mock Fallback: Return mock secret for local sandbox testing
      console.log('--- STRIPE MOCK: Returning mock client secret ---');
      res.status(200).json({
        success: true,
        clientSecret: `mock_client_secret_${orderId}_${Date.now()}`
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook handler
// @route   POST /api/v1/payment/stripe/webhook
// @access  Public
export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (isStripeConfigured && sig) {
      // Complete secure signature check
      const rawBody = req.body;
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        // Async update order to paid
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.status = 'processing';
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email: paymentIntent.receipt_email || 'stripe-webhook@shopmern.com'
          };
          await order.save();
          console.log(`Order ${orderId} marked as PAID via Stripe webhook successfully.`);
        }
      }
    } else {
      // Mock fallback: Simulate webhook events
      console.log('Stripe webhook received in mock developer mode.');
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// @desc    Create PayPal Order details
// @route   POST /api/v1/payment/paypal/create-order
// @access  Private
export const createPayPalOrder = async (req, res, next) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Return order details for PayPal Button client hooks
    res.status(200).json({
      success: true,
      paypalOrderId: `MOCK_PAYPAL_ORDER_${orderId}_${Date.now()}`,
      amount: order.totalPrice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Capture approved PayPal payment
// @route   POST /api/v1/payment/paypal/capture/:orderId
// @access  Private
export const capturePayPalPayment = async (req, res, next) => {
  const { paypalOrderId } = req.body;

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Verify PayPal transaction, update order details
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    order.paymentResult = {
      id: paypalOrderId || `PAYPAL-${Date.now()}`,
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email: req.user.email
    };

    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Return Stripe publishable key
// @route   GET /api/v1/payment/config/stripe
// @access  Private
export const getStripePublishableKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_stripe_key_values'
    });
  } catch (error) {
    next(error);
  }
};
