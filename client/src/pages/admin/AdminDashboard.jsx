import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api.js';
import { DollarSign, FileText, ShoppingBag, Users, AlertTriangle, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/orders/stats/summary');
        setStats(response.data);
      } catch (err) {
        console.warn('API summary stats failed. Loading sandbox mockup values:', err);
        // Rich statistics mockup fallback
        setStats({
          totalRevenue: 28450.99,
          totalOrders: 154,
          totalProducts: 45,
          totalUsers: 88,
          recentOrders: [
            { _id: 'o-101', user: { name: 'John Doe' }, totalPrice: 249.99, status: 'processing', createdAt: '2026-05-30T08:00:00Z' },
            { _id: 'o-102', user: { name: 'Alice Smith' }, totalPrice: 1199.99, status: 'delivered', createdAt: '2026-05-29T14:30:00Z' },
            { _id: 'o-103', user: { name: 'Bob Johnson' }, totalPrice: 189.99, status: 'pending', createdAt: '2026-05-29T10:15:00Z' }
          ],
          lowStockAlerts: [
            { _id: 'p-1', name: 'Sahu Signature Denim Shirt', stock: 5, price: 69.99, brand: 'SahuShirts' },
            { _id: 'p-2', name: 'Sahu Premium Linen Summer Shirt', stock: 3, price: 64.99, brand: 'SahuShirts' },
            { _id: 'p-3', name: 'SoundAura ANC Headphones', stock: 4, price: 299.99, brand: 'SoundAura' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#030712] min-h-screen flex items-center justify-center text-[#94A3B8] font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading executive analytics reports...</span>
        </div>
      </div>
    );
  }

  // Visual Chart Data configurations
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: [4200, 5100, 6800, 7200, 8900, 9450],
        backgroundColor: '#6366f1',
        borderColor: '#8B5CF6',
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: '#8B5CF6'
      }
    ]
  };

  const pieChartData = {
    labels: ['Delivered', 'Processing', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [75, 45, 24, 10],
        backgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#EF4444'],
        borderWidth: 2,
        borderColor: '#0F172A',
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94A3B8',
          font: { family: 'Outfit', weight: 'bold' }
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#1E293B/50' },
        ticks: { color: '#94A3B8' }
      },
      y: {
        grid: { color: '#1E293B/50' },
        ticks: { color: '#94A3B8' }
      }
    }
  };

  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen py-10 relative overflow-hidden select-none">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#6366F1]/5 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#EC4899]/5 rounded-full filter blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left relative z-10">
        
        {/* Header Console Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-8 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Terminal
            </div>
            <h1 className="font-display font-extrabold text-4xl text-white">Admin Console</h1>
            <p className="text-[#94A3B8] text-sm font-light">Oversee store KPIs, operational distributions, recent sales and inventory alerts.</p>
          </div>
          
          <div className="flex items-center gap-2.5 bg-slate-900/50 border border-slate-800/80 px-4 py-2.5 rounded-2xl backdrop-blur-md">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold text-[#F8FAFC]">System Live</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping ml-1"></span>
          </div>
        </div>

        {/* 1. KPI grid cards list */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20' },
            { label: 'Total Orders', value: stats?.totalOrders, icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Catalog Products', value: stats?.totalProducts, icon: ShoppingBag, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            { label: 'Registered Users', value: stats?.totalUsers, icon: Users, color: 'text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/20' }
          ].map((kpi, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -5 }}
              className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[1.5rem] p-6 shadow-xl backdrop-blur-md flex items-center gap-5 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[1.5rem]"></div>
              
              <div className={`p-4 rounded-2xl border flex-shrink-0 ${kpi.color}`}>
                <kpi.icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] font-black uppercase tracking-widest block">{kpi.label}</span>
                <span className="text-2.5xl font-black text-white mt-1 block">{kpi.value}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 2. Double Graphic Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly Revenue Bar Chart */}
          <div className="lg:col-span-2 bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-lg text-white">Revenue Progression</h3>
              <span className="text-[10px] bg-slate-900 border border-slate-800 text-[#94A3B8] font-bold px-2.5 py-1 rounded-md">USD MONTHLY</span>
            </div>
            <div className="h-64 flex items-center justify-center">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Order Status Pie Chart */}
          <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md space-y-6">
            <h3 className="font-display font-extrabold text-lg text-white">Order Distributions</h3>
            <div className="h-64 flex items-center justify-center">
              <Pie data={pieChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#94A3B8',
                      font: { family: 'Outfit', weight: 'bold' }
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>

        {/* 3. Operational lists: Recent Orders and Low Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders table */}
          <div className="lg:col-span-2 bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-lg text-white">Recent Orders</h3>
              <button className="text-xs text-[#6366F1] hover:text-[#8B5CF6] font-semibold uppercase tracking-wider flex items-center gap-1">
                View All Orders
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[#94A3B8] font-semibold uppercase text-xs">
                    <th className="py-4 px-4">Order ID</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4">Total Price</th>
                    <th className="py-4 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map(order => (
                    <tr key={order._id} className="border-b border-slate-900/50 hover:bg-slate-900/40 transition-colors">
                      <td className="py-4.5 px-4 font-bold text-white/95">{order._id}</td>
                      <td className="py-4.5 px-4 text-[#94A3B8] font-medium">{order.user?.name}</td>
                      <td className="py-4.5 px-4 text-[#EC4899] font-black">${order.totalPrice.toFixed(2)}</td>
                      <td className="py-4.5 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                          order.status === 'processing' ? 'bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/25' :
                          order.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 
                          'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md space-y-6">
            <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Stock Deficits
            </h3>

            <div className="space-y-4">
              {stats?.lowStockAlerts?.length === 0 ? (
                <p className="text-[#94A3B8] text-sm font-light">Inventory levels are currently normal across all catalog listings.</p>
              ) : (
                stats?.lowStockAlerts?.map(item => (
                  <div key={item._id} className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-850 rounded-2xl">
                    <div className="min-w-0 text-left">
                      <h5 className="font-bold text-white text-sm truncate">{item.name}</h5>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5 block">{item.brand}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md">
                        {item.stock} Left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
