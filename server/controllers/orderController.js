import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    couponCode
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      return next(new ErrorResponse('No order items provided', 400));
    }

    // 1. Double check and decrement stock atomically
    const decrementedProducts = [];
    try {
      for (const item of orderItems) {
        let product;
        if (item.size && item.color) {
          // Atomic check: decrease variant inventory only if stock >= qty
          product = await Product.findOneAndUpdate(
            {
              _id: item.product,
              isActive: true,
              variants: {
                $elemMatch: {
                  size: item.size,
                  color: item.color,
                  stock: { $gte: item.qty }
                }
              }
            },
            {
              $inc: {
                "variants.$[elem].stock": -item.qty,
                sold: item.qty
              }
            },
            {
              arrayFilters: [{ "elem.size": item.size, "elem.color": item.color }],
              new: true
            }
          );
        } else {
          // Fallback to simple product stock
          product = await Product.findOneAndUpdate(
            { _id: item.product, stock: { $gte: item.qty }, isActive: true },
            { $inc: { stock: -item.qty, sold: item.qty } },
            { new: true }
          );
        }

        if (!product) {
          throw new Error(`Insufficient stock or inactive listing for ${item.name} (${item.size || ''} ${item.color || ''})`);
        }

        decrementedProducts.push({ 
          productId: item.product, 
          qty: item.qty,
          size: item.size,
          color: item.color
        });
      }
    } catch (stockError) {
      // Rollback already decremented products if one of them fails
      for (const rollback of decrementedProducts) {
        if (rollback.size && rollback.color) {
          await Product.findOneAndUpdate(
            { _id: rollback.productId },
            {
              $inc: {
                "variants.$[elem].stock": rollback.qty,
                sold: -rollback.qty
              }
            },
            {
              arrayFilters: [{ "elem.size": rollback.size, "elem.color": rollback.color }]
            }
          );
        } else {
          await Product.findByIdAndUpdate(rollback.productId, {
            $inc: { stock: rollback.qty, sold: -rollback.qty }
          });
        }
      }
      return next(new ErrorResponse(stockError.message, 400));
    }

    // 2. Pricing calculations
    let itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Apply Coupon Code if sent
    let discountAmount = 0;
    let couponApplied = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && !coupon.isExpired()) {
        couponApplied = coupon.code;
        if (coupon.discountType === 'percent') {
          discountAmount = (itemsPrice * coupon.discountAmount) / 100;
        } else {
          discountAmount = coupon.discountAmount;
        }
        // Cap discount
        if (discountAmount > itemsPrice) {
          discountAmount = itemsPrice;
        }
      }
    }

    const subtotalAfterDiscount = itemsPrice - discountAmount;
    
    // Taxes: 15% flat rate
    const taxPrice = Number((0.15 * subtotalAfterDiscount).toFixed(2));
    
    // Shipping: Flat rate $10.00, free if subtotal > $100.00
    const shippingPrice = subtotalAfterDiscount > 100 ? 0 : 10;
    
    // Grand Total
    const totalPrice = Number((subtotalAfterDiscount + taxPrice + shippingPrice).toFixed(2));

    // 3. Create the order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      couponApplied,
      discountAmount,
      // Cash on delivery sets status to processing directly
      status: paymentMethod === 'cod' ? 'processing' : 'pending',
      isPaid: paymentMethod === 'cod' ? false : false
    });

    const createdOrder = await order.save();

    // 4. Clear the active shopping cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/v1/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Only owner or admin can retrieve
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this order details', 403));
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark unpaid order as Paid (PayPal Capture or Admin override)
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || 'N/A',
      status: req.body.status || 'Paid',
      update_time: req.body.update_time || new Date().toISOString(),
      email: req.body.email || req.user.email
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel unpaid/pending order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // User can only cancel own unpaid/pending orders. Admin can cancel any pending orders.
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to modify this order', 403));
    }

    if (order.status !== 'pending') {
      return next(new ErrorResponse('Cannot cancel order that is already being processed or shipped', 400));
    }

    order.status = 'cancelled';
    
    // Restore stock inventory levels
    for (const item of order.orderItems) {
      if (item.size && item.color) {
        await Product.findOneAndUpdate(
          { _id: item.product },
          {
            $inc: {
              "variants.$[elem].stock": item.qty,
              sold: -item.qty
            }
          },
          {
            arrayFilters: [{ "elem.size": item.size, "elem.color": item.color }]
          }
        );
      } else {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.qty, sold: -item.qty }
        });
      }
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'id name email').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order shipping/progress status (Admin only)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.status = status;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark order as delivered (Admin only)
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get e-commerce analytics totals (Admin only)
// @route   GET /api/v1/orders/stats/summary
// @access  Private/Admin
export const getOrderSummary = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();

    // Calculate dynamic stock levels
    const inStockCount = await Product.countDocuments({ stock: { $gt: 10 }, isActive: true });
    const outOfStockCount = await Product.countDocuments({ stock: 0, isActive: true });
    const lowStockCount = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 }, isActive: true });

    // Calculate employee metrics
    const totalEmployees = await Employee.countDocuments();
    const presentEmployees = await Employee.countDocuments({ attendanceStatus: 'Present' });

    // Sum overall revenues from paid e-commerce orders
    const salesData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = salesData.length > 0 ? salesData[0].totalSales : 0;

    // Monthly orders distribution for admin charts
    const monthlySales = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Pie chart order status breakdowns
    const statusData = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent 10 orders
    const recentOrders = await Order.find()
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(10);

    // Low stock warnings (< 10 units)
    const lowStockAlerts = await Product.find({ stock: { $lt: 10 }, isActive: true })
      .select('name stock price brand')
      .limit(5);

    res.status(200).json({
      success: true,
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      inStockCount,
      outOfStockCount,
      lowStockCount,
      totalEmployees,
      presentEmployees,
      monthlySales,
      statusData,
      recentOrders,
      lowStockAlerts
    });
  } catch (error) {
    next(error);
  }
};
