import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { ShoppingBag, Lock, Mail, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginUser, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectPath = searchParams.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    const res = await loginUser(email, password);
    if (res.success) {
      toast.success('Logged in successfully!');
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath ? `/${redirectPath}` : '/');
      }
    } else {
      toast.error(res.error || 'Authentication failed');
    }
  };

  const fillCredentials = (type) => {
    if (type === 'admin') {
      setEmail('zahooriftikhar296@gmail.com');
      setPassword('admin12345');
      toast.info('Autofilled seeded Administrator credentials!');
    } else if (type === 'employee') {
      navigate('/employee/login?autofill=employee');
      toast.info('Redirecting to Employee Portal with Cashier credentials!');
    } else {
      setEmail('fatima@shopmern.com');
      setPassword('customer12345');
      toast.info('Autofilled seeded Customer credentials!');
    }
  };

  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-[90vh] flex items-center justify-center py-16 px-4 relative overflow-hidden select-none">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#6366F1]/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#EC4899]/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-[#0F172A]/70 border border-slate-800 rounded-[2rem] p-8 shadow-2xl backdrop-blur-3xl w-full max-w-md z-10 text-left"
      >
        {/* Top diagonal reflection line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent"></div>

        <div className="space-y-3 text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-[#6366F1] font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Portal Access
          </Link>
          <h2 className="font-display font-extrabold text-3xl text-white">Welcome Back</h2>
          <p className="text-[#94A3B8] text-xs font-light max-w-xs mx-auto leading-relaxed">
            Enter your credentials to manage wishlists, orders, and administrative products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="zahooriftikhar296@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-white placeholder-slate-600 text-sm font-medium transition-all"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-white placeholder-slate-600 text-sm font-medium transition-all"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white font-bold py-3.5 rounded-xl shadow-xl shadow-indigo-600/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>

        <div className="text-center text-xs text-[#94A3B8] mt-6 pt-6 border-t border-slate-800/80">
          New to Smart Inventory?{' '}
          <Link to="/register" className="text-[#6366F1] font-bold hover:text-[#8B5CF6] transition-colors">
            Create an Account
          </Link>
        </div>

        {/* Sandbox Test Autofills Helper */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
          <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-wider block text-center">
            Sandbox Credentials
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillCredentials('customer')}
              className="py-2.5 px-2 bg-white/5 border border-white/10 text-[11px] font-semibold text-white/95 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#EC4899]" />
              Customer
            </button>
            <button
              onClick={() => fillCredentials('admin')}
              className="py-2.5 px-2 bg-white/5 border border-white/10 text-[11px] font-semibold text-white/95 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#6366F1]" />
              Admin
            </button>
            <button
              onClick={() => fillCredentials('employee')}
              className="py-2.5 px-2 bg-white/5 border border-white/10 text-[11px] font-semibold text-white/95 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Employee
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
