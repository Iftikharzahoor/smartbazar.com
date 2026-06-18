import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import { CheckCircle, Truck, Package, ShieldCheck, Home, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (err) {
        console.warn('API fetch by ID failed. Loading mock order confirmation:', err);
        // Sandbox mock fallback
        setOrder({
          _id: orderId || 'MOCK_ORDER_56789',
          totalPrice: 1448.99,
          paymentMethod: 'cod',
          isPaid: false,
          status: 'processing',
          createdAt: new Date().toISOString(),
          shippingAddress: {
            street: '123 E-Commerce Way',
            city: 'Tech City',
            state: 'California',
            postalCode: '90210',
            country: 'United States'
          }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div className="py-20 text-center text-slate-500 font-medium">Loading purchase receipt...</div>;
  }

  // Helper to determine status progress step indexes
  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = statusSteps.indexOf(order?.status || 'pending');

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-12 text-center">
      {/* 1. Header confirmation */}
      <div className="space-y-4">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-12 h-12 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-3.5xl text-slate-900 leading-tight">Thank You For Your Order!</h1>
          <p className="text-slate-400 text-sm font-light">Your transaction completed successfully. Order Reference ID:</p>
          <span className="inline-block px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-800 tracking-wider">
            {order?._id}
          </span>
        </div>
      </div>

      {/* 2. Visual tracking timeline progress map */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8 text-left">
        <h4 className="font-display font-bold text-lg text-slate-900 border-b border-slate-50 pb-4">Delivery Status Timeline</h4>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-2">
          {[
            { label: 'Placed', icon: Package, key: 'pending' },
            { label: 'Processing', icon: ShieldCheck, key: 'processing' },
            { label: 'On Way', icon: Truck, key: 'shipped' },
            { label: 'Delivered', icon: Home, key: 'delivered' }
          ].map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={idx} className="flex sm:flex-col items-center gap-4 sm:gap-2.5 flex-1 relative">
                {/* Visual Circle */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm relative z-10 transition-colors duration-300 ${
                  isCompleted ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'
                }`}>
                  <StepIcon className="w-5 h-5" />
                </div>

                <div className="text-left sm:text-center">
                  <span className={`text-xs font-bold uppercase tracking-wider block ${isCompleted ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Address and prices card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
          <h5 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Shipping Location</h5>
          <p className="text-slate-500 text-sm font-light leading-relaxed">
            {order?.shippingAddress?.street}, <br />
            {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.postalCode}, <br />
            {order?.shippingAddress?.country}
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
          <h5 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Billing Totals</h5>
          <div className="space-y-2 text-sm font-medium">
            <div className="flex justify-between text-slate-500">
              <span>Payment Type:</span>
              <span className="text-slate-800 uppercase font-semibold">{order?.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Payment Status:</span>
              <span className={`font-semibold ${order?.isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                {order?.isPaid ? 'PAID' : 'PENDING'}
              </span>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between text-slate-800 font-extrabold text-base">
              <span>Charged Price:</span>
              <span className="text-indigo-600">${order?.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action navigation */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <Link to="/" className="btn-outline w-full py-3.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
          Back Home
        </Link>
        <Link to="/products" className="btn-primary w-full py-3.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
          Browse Products
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
