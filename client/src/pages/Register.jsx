import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { ShoppingBag, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { registerUser, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    const res = await registerUser(name, email, password);
    if (res.success) {
      toast.success(res.message || 'Account created successfully! Check your email to verify.');
      navigate('/login');
    } else {
      toast.error(res.error || 'Registration failed');
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
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent"></div>

        <div className="space-y-3 text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-[#8B5CF6] font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Join Us Today
          </Link>
          <h2 className="font-display font-extrabold text-3xl text-white">Create Account</h2>
          <p className="text-[#94A3B8] text-xs font-light max-w-xs mx-auto leading-relaxed">
            Register a new account to unlock rapid checkout flows and private wishlists.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* Display Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">Display Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-white placeholder-slate-600 text-sm font-medium transition-all"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
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
                  placeholder="At least 8 characters"
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
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7c3aed] hover:to-[#db2777] text-white font-bold py-3.5 rounded-xl shadow-xl shadow-purple-600/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Registering...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>

        <div className="text-center text-xs text-[#94A3B8] mt-6 pt-6 border-t border-slate-800/80">
          Already have an account?{' '}
          <Link to="/login" className="text-[#8B5CF6] font-bold hover:text-[#EC4899] transition-colors">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
