import React from 'react';
import { Sparkles, Shield, Eye, Lock, Globe } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen py-16 relative overflow-hidden select-none">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#EC4899]/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 relative z-10 text-left">
        
        {/* Banner Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            Security Shield
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base leading-relaxed text-center">
            Review how ShopMERN and SahuShirts process, manage, and encrypt your account data.
          </p>
        </div>

        {/* Detailed Guidelines list */}
        <div className="bg-[#0F172A]/50 border border-slate-800 rounded-[2rem] p-8 md:p-12 shadow-xl backdrop-blur-md space-y-8 max-w-3xl mx-auto">
          
          <div className="flex gap-5 items-start">
            <div className="p-3.5 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] rounded-2xl flex-shrink-0">
              <Eye className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-lg text-white">1. Information Collection</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                We collect your display name, active email addresses, phone coordinates, and shipping destinations strictly during account creations and checkouts to fulfill shirt tailoring orders and coordinate carrier logistics (DHL, FedEx).
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start border-t border-slate-900 pt-8">
            <div className="p-3.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] rounded-2xl flex-shrink-0">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-lg text-white">2. Bank-Grade Financial Security</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                All payment transactions are fully encrypted using standard secure socket layers (SSL checkouts). We do NOT store your credit card credentials on our servers. Transactions are securely settled in real-time by Stripe & PayPal.
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start border-t border-slate-900 pt-8">
            <div className="p-3.5 bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] rounded-2xl flex-shrink-0">
              <Globe className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-lg text-white">3. Global Integrity & Cookies</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                ShopMERN implements stateful JWT refreshes in secure, HTTP-only Samesite cookies. This stateless mechanism allows you to browse active shirt catalogs seamlessly without personal data exposure risks. We maintain full GDPR compliance.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Privacy;
