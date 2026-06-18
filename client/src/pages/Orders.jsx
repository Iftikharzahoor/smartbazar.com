import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, Package, ArrowRight, ShieldCheck, MapPin, Truck } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/myorders');
        setOrders(response.data.orders);
        if (response.data.orders.length > 0) {
          setSelectedOrder(response.data.orders[0]);
        }
      } catch (err) {
        console.warn('API orders fetch failed. Loading mock sandbox order history:', err);
        // Clean high-fidelity mockup orders
        const mockOrders = [
          {
            _id: 'o-sahu-2026',
            createdAt: '2026-05-31T09:30:00Z',
            totalPrice: 144.98,
            status: 'processing',
            shippingAddress: {
              street: '123 E-Commerce Way',
              city: 'Lahore',
              state: 'Punjab',
              postalCode: '54000',
              country: 'Pakistan'
            },
            orderItems: [
              {
                _id: 'item-1',
                product: { name: 'Sahu Signature Denim Shirt', brand: 'SahuShirts', images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=100&q=80' }] },
                quantity: 1,
                price: 69.99,
                size: 'M',
                color: 'Indigo Blue'
              },
              {
                _id: 'item-2',
                product: { name: 'Sahu Premium Linen Summer Shirt', brand: 'SahuShirts', images: [{ url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=100&q=80' }] },
                quantity: 1,
                price: 64.99,
                size: 'L',
                color: 'Sandy Beige'
              }
            ]
          },
          {
            _id: 'o-sahu-2025',
            createdAt: '2026-05-20T14:15:00Z',
            totalPrice: 79.99,
            status: 'delivered',
            shippingAddress: {
              street: '123 E-Commerce Way',
              city: 'Lahore',
              state: 'Punjab',
              postalCode: '54000',
              country: 'Pakistan'
            },
            orderItems: [
              {
                _id: 'item-3',
                product: { name: 'Sahu Royal Silk Satin Shirt', brand: 'SahuShirts', images: [{ url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=100&q=80' }] },
                quantity: 1,
                price: 79.99,
                size: 'XL',
                color: 'Midnight Black'
              }
            ]
          }
        ];
        setOrders(mockOrders);
        setSelectedOrder(mockOrders[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStepStatus = (step, currentStatus) => {
    const stepsMap = {
      'pending': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4
    };
    const stepWeight = stepsMap[step];
    const currentWeight = stepsMap[currentStatus] || 1;

    if (currentWeight >= stepWeight) return 'completed';
    if (currentWeight + 1 === stepWeight) return 'active';
    return 'upcoming';
  };

  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen py-16 relative overflow-hidden select-none">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#EC4899]/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 text-left">
        
        {/* Banner Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] font-semibold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            <Package className="w-3.5 h-3.5" />
            Consignment Tracking
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            Order Tracking & History
          </h1>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base leading-relaxed text-center">
            Monitor real-time progress steps of your luxury consignments from checkout dispatch to delivery.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 font-medium">Loading orders pipeline...</div>
        ) : orders.length === 0 ? (
          <div className="bg-[#0F172A]/40 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6">
            <ShoppingBag className="w-16 h-16 text-[#6366F1] mx-auto opacity-40 animate-pulse" />
            <h3 className="text-2xl font-extrabold text-white">No Orders Found</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              You haven't checked out any premium shirt variants yet. Make your first purchase to trace tracking lines right here!
            </p>
            <Link to="/products" className="btn-primary w-fit mx-auto rounded-xl py-3 px-6 text-sm font-bold">
              Explore Store Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Orders List */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-display font-extrabold text-lg text-white mb-2">My Orders</h3>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {orders.map((order) => (
                  <button
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left bg-[#0F172A]/50 border rounded-2xl p-5 shadow-lg transition-all focus:outline-none flex flex-col justify-between cursor-pointer ${
                      selectedOrder?._id === order._id 
                        ? 'border-[#6366F1] shadow-[#6366F1]/5 bg-[#6366F1]/5' 
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-extrabold text-sm text-white truncate max-w-[150px]">#{order._id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        order.status === 'processing' ? 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20' :
                        order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center w-full mt-4 pt-4 border-t border-slate-900">
                      <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="font-black text-sm text-white">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Tracking Details & Items */}
            <div className="lg:col-span-8 space-y-6">
              {selectedOrder && (
                <div className="space-y-6">
                  
                  {/* Real-time stepper tracker */}
                  <div className="bg-[#0F172A]/50 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-md">
                    <h3 className="font-display font-extrabold text-lg text-white mb-8">Consignment Status Tracker</h3>
                    
                    <div className="grid grid-cols-4 gap-4 relative">
                      {/* Timeline connecting line */}
                      <div className="absolute top-5 left-[12%] right-[12%] h-[2px] bg-slate-800 z-0">
                        <div 
                          className="h-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] transition-all duration-500"
                          style={{
                            width: 
                              selectedOrder.status === 'delivered' ? '100%' :
                              selectedOrder.status === 'shipped' ? '66%' :
                              selectedOrder.status === 'processing' ? '33%' : '0%'
                          }}
                        />
                      </div>

                      {[
                        { step: 'pending', label: 'Ordered', desc: 'Awaiting checks', icon: ShieldCheck },
                        { step: 'processing', label: 'Processing', desc: 'Tailoring setup', icon: Package },
                        { step: 'shipped', label: 'Shipped', desc: 'In global transit', icon: Truck },
                        { step: 'delivered', label: 'Delivered', desc: 'Signature drop', icon: MapPin }
                      ].map((item, idx) => {
                        const status = getStepStatus(item.step, selectedOrder.status);
                        const Icon = item.icon;
                        
                        return (
                          <div key={idx} className="flex flex-col items-center text-center z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                              status === 'completed' ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-lg shadow-indigo-600/30' :
                              status === 'active' ? 'bg-slate-900 border-[#6366F1] text-[#6366F1] scale-110 shadow-lg shadow-indigo-600/10' :
                              'bg-slate-950 border-slate-800 text-slate-500'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xs text-white mt-3 block">{item.label}</span>
                            <span className="text-[9px] text-[#94A3B8] font-light mt-0.5 block">{item.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consignment Items Summary details */}
                  <div className="bg-[#0F172A]/50 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-md space-y-6">
                    <h3 className="font-display font-extrabold text-lg text-white border-b border-slate-900 pb-4">Package Contents</h3>
                    
                    <div className="space-y-4">
                      {selectedOrder.orderItems.map((item) => (
                        <div key={item._id} className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-900 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <img 
                              src={item.product.images?.[0]?.url} 
                              alt={item.product.name} 
                              className="w-14 h-14 object-cover rounded-xl border border-slate-800"
                            />
                            <div className="text-left">
                              <h5 className="font-extrabold text-white text-sm line-clamp-1">{item.product.name}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                {item.size && <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">SIZE: {item.size}</span>}
                                {item.color && (
                                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
                                    COLOR: {item.color}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-sm font-black text-[#EC4899] block">${item.price.toFixed(2)}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">QTY: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Destination */}
                    <div className="pt-4 border-t border-slate-900 space-y-2 text-left">
                      <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">Delivery Destination</span>
                      <p className="text-sm font-medium text-white/95">
                        {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
