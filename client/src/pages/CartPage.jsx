import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { Trash2, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    coupon,
    updateItemQty,
    removeItemFromCart,
    applyCouponCode,
    clearCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleQtyChange = async (productId, quantity, cartItemId) => {
    if (quantity < 1) return;
    const res = await updateItemQty(productId, quantity, cartItemId);
    if (!res.success) {
      toast.error(res.error || 'Failed to update quantity');
    }
  };

  const handleRemove = async (productId, cartItemId) => {
    const res = await removeItemFromCart(productId, cartItemId);
    if (res.success) {
      toast.success('Product removed from cart');
    } else {
      toast.error(res.error || 'Failed to remove product');
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = await applyCouponCode(couponInput);
    if (res.success) {
      toast.success(res.message);
      setCouponInput('');
    } else {
      toast.error(res.error);
    }
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to proceed with checkout!');
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-2xl text-slate-900">Your Shopping Cart is Empty</h2>
          <p className="text-slate-400 text-sm font-light leading-relaxed">
            Looks like you have not added any products to your cart yet. Browse our premium collections to get started!
          </p>
        </div>
        <Link to="/products" className="btn-primary w-full py-3 text-sm font-semibold rounded-xl block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Calculate overall discount amount
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'percent') {
      discountAmount = (itemsPrice * coupon.discountAmount) / 100;
    } else {
      discountAmount = coupon.discountAmount;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-left space-y-1 border-b border-slate-100 pb-6">
        <h1 className="font-display font-extrabold text-3.5xl text-slate-900">Shopping Cart</h1>
        <p className="text-slate-400 text-sm font-light">Confirm your selected items, modify quantities, and apply discount promo codes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            const product = item.product;
            const singlePrice = product.discountPrice || product.price;

            return (
              <div
                key={item._id || product._id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-6 text-left"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info and Quantities */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{product.brand}</span>
                      <Link to={`/products/${product.slug || product._id}`}>
                        <h4 className="font-semibold text-slate-800 text-base line-clamp-1 hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h4>
                      </Link>
                      {(item.size || item.color) && (
                        <div className="flex gap-2.5 mt-1">
                          {item.size && (
                            <span className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded gap-1">
                              Color: 
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block border border-slate-200"
                                style={{ backgroundColor: item.color.toLowerCase() }}
                              ></span>
                              {item.color}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemove(product._id, item._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50/50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50/50 overflow-hidden">
                      <button
                        onClick={() => handleQtyChange(product._id, item.quantity - 1, item._id)}
                        className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 font-bold active:bg-slate-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 font-bold text-sm text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(product._id, item.quantity + 1, item._id)}
                        className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 font-bold active:bg-slate-200 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-base text-slate-900">${(singlePrice * item.quantity).toFixed(2)}</span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-slate-400 font-semibold block">${singlePrice.toFixed(2)} each</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary & Coupon Card */}
        <div className="space-y-6 text-left">
          {/* 1. Applied Coupon Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">Have a Promo Coupon?</h4>
            {coupon ? (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-indigo-700 font-semibold text-sm">
                  <Tag className="w-4.5 h-4.5" />
                  <span>{coupon.code} applied!</span>
                </div>
                <button onClick={clearCoupon} className="p-1 hover:bg-indigo-100/60 rounded-full text-indigo-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. SAVE10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                />
                <button type="submit" className="btn-secondary py-2.5 px-5 text-sm rounded-xl font-semibold">
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* 2. Pricing Breakdown details */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
            <h4 className="font-display font-bold text-lg text-slate-900">Summary</h4>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal Items</span>
                <span className="text-slate-800 font-semibold">${itemsPrice.toFixed(2)}</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount Applied ({coupon.code})</span>
                  <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500 font-medium">
                <span>Estimated Taxes (15%)</span>
                <span className="text-slate-800 font-semibold">${taxPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-500 font-medium">
                <span>Estimated Shipping</span>
                <span className="text-slate-800 font-semibold">
                  {shippingPrice === 0 ? <span className="text-indigo-600 font-bold uppercase">FREE</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>

              <hr className="border-slate-100 my-2" />

              <div className="flex justify-between text-slate-800 font-extrabold text-lg">
                <span>Grand Total</span>
                <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="btn-primary w-full py-3.5 font-bold flex items-center justify-center gap-2 text-base"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
