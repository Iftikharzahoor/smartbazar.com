import { createSlice } from '@reduxjs/toolkit';

const initialCartItems = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  cartItems: initialCartItems,
  coupon: null,
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0
};

const calculatePrices = (state) => {
  // Base cost calculation
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  // Apply discounts
  let discount = 0;
  if (state.coupon) {
    if (state.coupon.discountType === 'percent') {
      discount = (state.itemsPrice * state.coupon.discountAmount) / 100;
    } else {
      discount = state.coupon.discountAmount;
    }
  }

  const subtotal = Math.max(0, state.itemsPrice - discount);

  // Taxes: 15% flat rate
  state.taxPrice = Number((0.15 * subtotal).toFixed(2));

  // Shipping: Free if subtotal > $100
  state.shippingPrice = subtotal > 100 || subtotal === 0 ? 0 : 10;

  // Grand Total
  state.totalPrice = Number((subtotal + state.taxPrice + state.shippingPrice).toFixed(2));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartItems = action.payload;
      calculatePrices(state);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    localAddItem: (state, action) => {
      const item = { ...action.payload };
      if (!item._id) {
        item._id = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      const existItem = state.cartItems.find(x => 
        x.product._id === item.product._id && 
        x.size === item.size && 
        x.color === item.color
      );

      if (existItem) {
        existItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }

      calculatePrices(state);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    localUpdateQty: (state, action) => {
      const { productId, quantity, cartItemId } = action.payload;
      const existItem = state.cartItems.find(x => 
        cartItemId ? x._id === cartItemId : x.product._id === productId
      );

      if (existItem) {
        existItem.quantity = quantity;
      }

      calculatePrices(state);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    localRemoveItem: (state, action) => {
      const { productId, cartItemId } = action.payload;
      state.cartItems = state.cartItems.filter(x => 
        cartItemId ? x._id !== cartItemId : x.product._id !== productId
      );
      calculatePrices(state);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    applyCouponSuccess: (state, action) => {
      state.coupon = action.payload;
      calculatePrices(state);
    },
    clearCoupon: (state) => {
      state.coupon = null;
      calculatePrices(state);
    },
    clearCartState: (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.itemsPrice = 0;
      state.taxPrice = 0;
      state.shippingPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cartItems');
    }
  }
});

export const {
  setCart,
  localAddItem,
  localUpdateQty,
  localRemoveItem,
  applyCouponSuccess,
  clearCoupon,
  clearCartState
} = cartSlice.actions;

export default cartSlice.reducer;
