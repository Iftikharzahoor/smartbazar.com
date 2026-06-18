import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HelpCircle, ChevronDown, MessageSquare, Mail, Phone } from 'lucide-react';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      q: "How do I choose dynamic size and color shirt variants?",
      a: "Simply browse to any shirt page (e.g. Sahu Premium Linen Summer Shirt) and click your desired color swatch. The size selectors will automatically update in real-time, showing stock deficits immediately. Sizes out of stock in a specific color will display struck-through and be locked from selection."
    },
    {
      q: "What are your delivery estimates for Lahore and worldwide?",
      a: "For local orders within Lahore, Pakistan, we offer premium Next-Day Air shipping. International orders are handled by premium couriers (DHL, FedEx, UPS) and take approximately 3 to 7 business days, depending on custom regulations."
    },
    {
      q: "Are financial transactions fully secure?",
      a: "Yes! Every checkout session in ShopMERN is encrypted using standard AES-256 SSL algorithms. Payments are completely coordinated and settled securely by Stripe and PayPal gateways."
    },
    {
      q: "How do I trace my consignment in real-time?",
      a: "Once you complete checkout, click your profile dropdown and select 'Order History'. You will be presented with our real-time tracker displaying progress steppers (Ordered -> Processing -> Shipped -> Delivered) detailing address coordinates."
    }
  ];

  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen py-16 relative overflow-hidden select-none">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#EC4899]/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 relative z-10 text-left">
        
        {/* Banner Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            <HelpCircle className="w-3.5 h-3.5" />
            Support Hub
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            FAQs & Support
          </h1>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base leading-relaxed text-center">
            Find rapid resolutions to structural checkout configurations and shirt variant selections.
          </p>
        </div>

        {/* FAQs Accordion Grid */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqData.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-[#0F172A]/50 border border-slate-800 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md"
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none cursor-pointer hover:bg-slate-900/40 transition-colors"
                >
                  <span className="font-extrabold text-[#F8FAFC] text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#6366F1] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-[#94A3B8] font-light leading-relaxed text-xs sm:text-sm border-t border-slate-900">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Contact direct card */}
        <div className="bg-[#0F172A]/40 border border-slate-800 rounded-[2rem] p-8 max-w-xl mx-auto text-center space-y-6">
          <MessageSquare className="w-10 h-10 text-[#6366F1] mx-auto" />
          <h3 className="text-xl font-extrabold text-white">Still Have Questions?</h3>
          <p className="text-slate-400 text-xs font-light leading-relaxed max-w-md mx-auto">
            If you cannot locate solutions inside our FAQ grid, connect with our founder and lead developer directly!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:zahooriftikhar296@gmail.com"
              className="flex items-center gap-2 text-xs font-bold text-white bg-white/5 border border-white/10 hover:border-white/20 py-2.5 px-4 rounded-xl transition-all w-fit"
            >
              <Mail className="w-4 h-4 text-[#EC4899]" />
              zahooriftikhar296@gmail.com
            </a>
            <a 
              href="tel:03166794173"
              className="flex items-center gap-2 text-xs font-bold text-white bg-white/5 border border-white/10 hover:border-white/20 py-2.5 px-4 rounded-xl transition-all w-fit"
            >
              <Phone className="w-4 h-4 text-[#6366F1]" />
              03166794173
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Faq;
