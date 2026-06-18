import { useSelector, useDispatch } from 'react-redux';
import {
  setCart,
  localAddItem,
  localUpdateQty,
  localRemoveItem,
  applyCouponSuccess,
  clearCoupon,
  clearCartState
} from '../features/cart/cartSlice.js';
import api from '../services/api.js';

export const useCart = () => {
  const dispatch = useDispatch();
  const cartState = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  const fetchCart = async () => {
    if (isAuthenticated) {
      try {
        const response = await api.get('/cart');
        dispatch(setCart(response.data.cart.items));
      } catch (err) {
        console.error('Failed to fetch DB cart:', err);
      }
    }
  };

  const addItemToCart = async (product, quantity = 1, size = '', color = '') => {
    const s = size || product.size || '';
    const c = color || product.color || '';
    if (isAuthenticated) {
      try {
        const response = await api.post('/cart', { productId: product._id, quantity, size: s, color: c });
        dispatch(setCart(response.data.cart.items));
        return { success: true };
      } catch (err) {
        return { success: false, error: err.response?.data?.error || 'Failed to add item' };
      }
    } else {
      dispatch(localAddItem({ product, quantity, size: s, color: c }));
      return { success: true };
    }
  };

  const updateItemQty = async (productId, quantity, cartItemId) => {
    if (isAuthenticated && cartItemId) {
      try {
        const response = await api.put(`/cart/${cartItemId}`, { quantity });
        dispatch(setCart(response.data.cart.items));
        return { success: true };
      } catch (err) {
        return { success: false, error: err.response?.data?.error || 'Failed to update quantity' };
      }
    } else {
      dispatch(localUpdateQty({ productId, quantity, cartItemId }));
      return { success: true };
    }
  };

  const removeItemFromCart = async (productId, cartItemId) => {
    if (isAuthenticated && cartItemId) {
      try {
        const response = await api.delete(`/cart/${cartItemId}`);
        dispatch(setCart(response.data.cart.items));
        return { success: true };
      } catch (err) {
        return { success: false, error: err.response?.data?.error || 'Failed to remove item' };
      }
    } else {
      dispatch(localRemoveItem({ productId, cartItemId }));
      return { success: true };
    }
  };

  const mergeGuestCart = async () => {
    if (isAuthenticated && cartState.cartItems.length > 0) {
      try {
        for (const item of cartState.cartItems) {
          await api.post('/cart', { 
            productId: item.product._id, 
            quantity: item.quantity,
            size: item.size || '',
            color: item.color || ''
          });
        }
        const response = await api.get('/cart');
        dispatch(setCart(response.data.cart.items));
      } catch (err) {
        console.error('Failed to merge guest cart:', err);
      }
    }
  };

  const applyCouponCode = async (code) => {
    try {
      const validCoupons = {
        'SAVE10': { code: 'SAVE10', discountType: 'percent', discountAmount: 10 },
        'WELCOME50': { code: 'WELCOME50', discountType: 'fixed', discountAmount: 50 }
      };

      const matched = validCoupons[code.toUpperCase()];
      if (matched) {
        dispatch(applyCouponSuccess(matched));
        return { success: true, message: 'Coupon applied successfully!' };
      } else {
        return { success: false, error: 'Invalid or expired coupon code' };
      }
    } catch (err) {
      return { success: false, error: 'Failed to apply coupon' };
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error('Failed to clear DB cart:', err);
      }
    }
    dispatch(clearCartState());
  };

  return {
    ...cartState,
    fetchCart,
    addItemToCart,
    updateItemQty,
    removeItemFromCart,
    mergeGuestCart,
    applyCouponCode,
    clearCoupon: () => dispatch(clearCoupon()),
    clearCart
  };
};
