import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';
import { MapPin, CreditCard, ShoppingBag, Landmark, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, totalPrice, itemsPrice, taxPrice, shippingPrice, coupon, clearCart } = useCart();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment Method, 3: Review
  
  // Shipping form states
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || '');
  const [state, setState] = useState(user?.addresses?.[0]?.state || '');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '');
  const [country, setCountry] = useState(user?.addresses?.[0]?.country || 'United States');
  
  // Payment methods
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default COD for easy sandbox checkouts

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!street || !city || !state || !postalCode || !country) {
      toast.error('Please complete all shipping address fields');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        name: item.product.name,
        qty: item.quantity,
        image: item.product.images?.[0]?.url || '',
        price: item.product.discountPrice || item.product.price,
        size: item.size || '',
        color: item.color || '',
        product: item.product._id
      }));

      const shippingAddress = { street, city, state, postalCode, country };

      const response = await api.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod,
        couponCode: coupon?.code
      });

      const { order } = response.data;
      toast.success('Order placed successfully!');
      
      // Clear client cart
      await clearCart();
      
      // Route to confirmation screen
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Order placement transaction failed');
    }
  };

  if (cartItems.length === 0) {
    return <div className="py-20 text-center text-slate-500 font-medium">No active checkout items found in cart.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header and progress wizard steps */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center border-b border-slate-100 pb-8">
        <div className="text-left space-y-1">
          <h1 className="font-display font-extrabold text-3.5xl text-slate-900">Secure Checkout</h1>
          <p className="text-slate-400 text-sm font-light">Complete address details and choose a preferred payment option.</p>
        </div>

        {/* Dynamic step map indicator */}
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className={`px-4 py-2 rounded-xl border ${step >= 1 ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}>
            1. Shipping
          </span>
          <span className="text-slate-300">—</span>
          <span className={`px-4 py-2 rounded-xl border ${step >= 2 ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}>
            2. Payment
          </span>
          <span className="text-slate-300">—</span>
          <span className={`px-4 py-2 rounded-xl border ${step >= 3 ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}>
            3. Place Order
          </span>
        </div>
      </div>

      {/* 2. Wizard column dividers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-left">
        {/* Left Column: Form Wizards */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Address Form */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2.5">
                <MapPin className="w-5.5 h-5.5 text-indigo-600" />
                Shipping Address
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Main St, Apt 4"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Tech City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase">State / Province</label>
                    <input
                      type="text"
                      required
                      placeholder="California"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Postal Code</label>
                    <input
                      type="text"
                      required
                      placeholder="90210"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Country</label>
                    <input
                      type="text"
                      required
                      placeholder="United States"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 text-sm font-semibold">
                Proceed to Payment options
              </button>
            </form>
          )}

          {/* Step 2: Payment Method Select */}
          {step === 2 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2.5">
                <CreditCard className="w-5.5 h-5.5 text-indigo-600" />
                Select Payment Method
              </h3>

              <div className="flex flex-col gap-4">
                {[
                  { id: 'cod', label: 'Cash on Delivery (COD)', icon: Landmark, desc: 'Place order and settle payments in cash upon physical delivery.' },
                  { id: 'stripe', label: 'Stripe Secure Credit Card', icon: CreditCard, desc: 'PCI DSS-compliant checkout supporting mock sandbox card verification.' },
                  { id: 'paypal', label: 'PayPal Express Checkout', icon: ShoppingBag, desc: 'Settle order using official PayPal buttons integrations.' }
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer hover:bg-slate-50 transition-all ${
                      paymentMethod === opt.id ? 'border-indigo-600 bg-indigo-50/20 shadow-indigo-600/5' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="mt-1 w-4.5 h-4.5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <div className="flex gap-3">
                      <div className={`p-2.5 rounded-lg flex-shrink-0 ${paymentMethod === opt.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>
                        <opt.icon className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{opt.label}</h4>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{opt.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-outline w-1/3 py-3.5 text-sm font-semibold">
                  Back Address
                </button>
                <button onClick={() => setStep(3)} className="btn-primary w-2/3 py-3.5 text-sm font-semibold">
                  Review Summary
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Placing Order Final Check */}
          {step === 3 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2.5">
                <ShieldCheck className="w-5.5 h-5.5 text-indigo-600" />
                Final Order Placement
              </h3>

              <div className="space-y-4 text-sm bg-slate-50/50 border border-slate-100 rounded-2xl p-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Shipping Target</h4>
                  <p className="text-slate-500 text-sm font-light mt-1.5 leading-relaxed">
                    {street}, {city}, {state} {postalCode}, {country}
                  </p>
                </div>

                <hr className="border-slate-100" />

                <div>
                  <h4 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Payment Selection</h4>
                  <p className="text-slate-500 text-sm font-semibold mt-1.5 uppercase text-indigo-600">
                    {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : paymentMethod === 'stripe' ? 'Stripe Credit' : 'PayPal Express'}
                  </p>
                </div>
              </div>

              {paymentMethod === 'stripe' && (
                <div className="border border-indigo-100 bg-indigo-50/40 rounded-2xl p-5 space-y-2 text-center">
                  <p className="text-indigo-700 font-semibold text-sm">Stripe Sandbox Card inputs configured</p>
                  <p className="text-indigo-600/70 text-xs font-light">
                    Submit the order using test values. Use card number <strong className="font-semibold text-indigo-600">4242 4242 4242 4242</strong> during simulated credit checks.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="btn-outline w-1/3 py-3.5 text-sm font-semibold">
                  Back Payment
                </button>
                <button onClick={handlePlaceOrder} className="btn-primary w-2/3 py-3.5 text-sm font-bold">
                  Place Order — ${totalPrice.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Pricing Summary */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
          <h4 className="font-display font-bold text-lg text-slate-900">Order Basket</h4>

          {/* Cart list items */}
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item._id || item.product._id} className="flex items-center gap-3.5 text-sm">
                <img
                  src={item.product.images?.[0]?.url || 'https://via.placeholder.com/60'}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-slate-800 truncate">{item.product.name}</h5>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Qty: {item.quantity}</span>
                    {(item.size || item.color) && (
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-50 px-1.5 py-0.5 rounded">
                        {item.size ? `${item.size} ` : ''}{item.color ? `/ ${item.color}` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-bold text-slate-700">
                  ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-slate-100" />

          {/* Calculations details */}
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Subtotal Cost</span>
              <span className="text-slate-800 font-semibold">${itemsPrice.toFixed(2)}</span>
            </div>

            {coupon && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Applied</span>
                <span className="font-bold">-{coupon.discountType === 'percent' ? `${coupon.discountAmount}%` : `$${coupon.discountAmount}`}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500 font-medium">
              <span>Taxes Flat (15%)</span>
              <span className="text-slate-800 font-semibold">${taxPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-500 font-medium">
              <span>Shipping Fee</span>
              <span className="text-slate-800 font-semibold">
                {shippingPrice === 0 ? <span className="text-indigo-600 font-bold uppercase">FREE</span> : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            <hr className="border-slate-100 my-1" />

            <div className="flex justify-between text-slate-800 font-extrabold text-base">
              <span>Grand Total</span>
              <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
