import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Sparkles, ShieldCheck, Edit3 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  // Account Form states
  const [name, setName] = useState(user?.name || 'Iftikhar Zahoor');
  const [phone, setPhone] = useState(user?.phone || '03166794173');
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '123 E-Commerce Way');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Lahore');

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success('Your profile details updated successfully!');
  };

  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen py-16 relative overflow-hidden select-none">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#EC4899]/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 relative z-10 text-left">
        
        {/* Banner Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Dashboard
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            My Profile
          </h1>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base leading-relaxed text-center">
            Review your client statistics, shipping vectors, and update your personal credentials.
          </p>
        </div>

        {/* Profile Card double layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Summary Card */}
          <div className="md:col-span-4 bg-[#0F172A]/50 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md text-center space-y-6">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={user?.avatar || '/user_photo.png'} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-xl text-white">{name}</h3>
              <span className="text-[10px] text-[#6366F1] font-black uppercase tracking-widest block">
                {user?.role === 'admin' ? 'Administrator' : 'Premium Client'}
              </span>
            </div>

            <div className="border-t border-slate-850 pt-4 text-left space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="truncate">{user?.email || 'zahooriftikhar296@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Account Verified</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="md:col-span-8 bg-[#0F172A]/50 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-md">
            <h3 className="font-display font-extrabold text-lg text-white mb-6 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#6366F1]" />
              Account Settings
            </h3>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Full name */}
                <div className="space-y-2">
                  <label className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">Display Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-5 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-white text-sm font-medium transition-all"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  </div>
                </div>

                {/* Phone number */}
                <div className="space-y-2">
                  <label className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">Phone Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-5 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-white text-sm font-medium transition-all"
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  </div>
                </div>

                {/* Shipping address */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">Street Address</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={street} 
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full pl-11 pr-5 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-white text-sm font-medium transition-all"
                    />
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  </div>
                </div>

                {/* Shipping city */}
                <div className="space-y-2">
                  <label className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">City</label>
                  <input 
                    type="text" 
                    required 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-white text-sm font-medium transition-all"
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest block">Country</label>
                  <input 
                    type="text" 
                    disabled 
                    value="Pakistan" 
                    className="w-full px-5 py-3 bg-slate-950/40 border border-slate-850 rounded-xl text-slate-500 text-sm font-medium cursor-not-allowed"
                  />
                </div>

              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-fit bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white font-bold px-6 py-3 rounded-xl shadow-xl shadow-indigo-600/20 text-xs tracking-wider uppercase cursor-pointer"
              >
                Save Profile Changes
              </motion.button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
