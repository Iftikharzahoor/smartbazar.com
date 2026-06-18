import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { FileText, Eye, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders);
      } catch (err) {
        console.warn('API fetch failed. Loading mock orders list:', err);
        setOrders([
          { _id: 'o-101', user: { name: 'John Doe', email: 'customer@shopmern.com' }, totalPrice: 249.99, status: 'processing', isPaid: true },
          { _id: 'o-102', user: { name: 'Alice Smith', email: 'alice@shopmern.com' }, totalPrice: 1199.99, status: 'delivered', isPaid: true },
          { _id: 'o-103', user: { name: 'Bob Johnson', email: 'bob@shopmern.com' }, totalPrice: 189.99, status: 'pending', isPaid: false }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleShip = async (id) => {
    try {
      await api.put(`/orders/${id}/status`, { status: 'shipped' });
      toast.success('Order status updated to Shipped!');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'shipped' } : o));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="border-b border-slate-100 pb-6 space-y-1">
        <h1 className="font-display font-extrabold text-3.5xl text-slate-900 flex items-center gap-2">
          <FileText className="w-8 h-8 text-indigo-600" />
          Manage Orders
        </h1>
        <p className="text-slate-400 text-sm font-light">Monitor transactions billing status and update shipping progress markers.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading orders database...</div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-xs">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Paid</th>
                <th className="py-4 px-6">Total Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-6 font-bold text-slate-700">{order._id}</td>
                  <td className="py-5 px-6">
                    <p className="font-semibold text-slate-800">{order.user?.name}</p>
                    <span className="text-xs text-slate-400">{order.user?.email}</span>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      order.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.isPaid ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-indigo-600 font-bold">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-5 px-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                      order.status === 'processing' ? 'bg-indigo-50 text-indigo-600' :
                      order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-center">
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleShip(order._id)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg font-semibold text-xs active:scale-95 transition-all"
                      >
                        Ship Order
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
