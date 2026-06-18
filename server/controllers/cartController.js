import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

// @desc    Get current user's cart
// @route   GET /api/v1/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      // Create a default empty cart if one doesn't exist yet
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart or merge guest cart
// @route   POST /api/v1/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  const { productId, quantity, size, color } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Determine stock limit based on variant presence
    let availableStock = product.stock;
    let hasVariants = product.variants && product.variants.length > 0;
    let matchedVariant = null;

    if (hasVariants && size && color) {
      matchedVariant = product.variants.find(
        v => v.size.toLowerCase() === size.toLowerCase() && v.color.toLowerCase() === color.toLowerCase()
      );
      if (!matchedVariant) {
        return next(new ErrorResponse(`Selected variant (Size: ${size}, Color: ${color}) not found`, 404));
      }
      availableStock = matchedVariant.stock;
    }

    if (availableStock < quantity) {
      return next(new ErrorResponse(`Only ${availableStock} items left in stock for this selection`, 400));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in the cart (matching productId, size, and color)
    const itemIndex = cart.items.findIndex(item => {
      const matchProduct = item.product.toString() === productId;
      const matchSize = hasVariants ? item.size === size : true;
      const matchColor = hasVariants ? item.color === color : true;
      return matchProduct && matchSize && matchColor;
    });

    if (itemIndex > -1) {
      // Item exists, update the quantity
      const newQuantity = cart.items[itemIndex].quantity + (quantity || 1);
      if (availableStock < newQuantity) {
        return next(new ErrorResponse(`Only ${availableStock} items left in stock. Cannot add more.`, 400));
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // Item does not exist, add it
      const newItem = { product: productId, quantity: quantity || 1 };
      if (hasVariants && size && color) {
        newItem.size = size;
        newItem.color = color;
      }
      cart.items.push(newItem);
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
      return next(new ErrorResponse('Cart item not found', 404));
    }

    // Verify stock availability
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product || !product.isActive) {
      return next(new ErrorResponse('Product not found or inactive', 404));
    }

    let availableStock = product.stock;
    const cartItem = cart.items[itemIndex];
    const hasVariants = product.variants && product.variants.length > 0;

    if (hasVariants && cartItem.size && cartItem.color) {
      const matchedVariant = product.variants.find(
        v => v.size.toLowerCase() === cartItem.size.toLowerCase() && v.color.toLowerCase() === cartItem.color.toLowerCase()
      );
      if (matchedVariant) {
        availableStock = matchedVariant.stock;
      }
    }

    if (availableStock < quantity) {
      return next(new ErrorResponse(`Only ${availableStock} items available in stock for this selection`, 400));
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/v1/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};
