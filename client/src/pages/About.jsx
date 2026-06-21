import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Code, Cpu, Smartphone, Award, Coffee } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen py-16 relative overflow-hidden select-none">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#EC4899]/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 text-left">
        
        {/* Banner Title */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Lead Innovator
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            About the Developer
          </h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto font-light text-base leading-relaxed text-center">
            Meet the architectural engineer behind Smart Inventory — designing world-class stateless web platforms and premium digital retail ecosystems.
          </p>
        </div>

        {/* Double Column profile card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#0F172A]/40 border border-slate-800/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-md">
          
          {/* Profile photo block */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="absolute -inset-1.5 rounded-[2rem] bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] opacity-35 blur-xl"></div>
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-950 border border-white/10 w-full aspect-square max-w-[280px]">
              <img 
                src="/user_photo.png" 
                alt="Iftikhar Zahoor Portrait" 
                className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Profile description details */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-extrabold text-white">Iftikhar Zahoor</h2>
              <span className="text-sm text-[#6366F1] font-semibold tracking-wider uppercase block">Founder & Lead Software Developer</span>
            </div>

            <p className="text-[#94A3B8] font-light leading-relaxed text-sm">
              Iftikhar Zahoor is an elite Full-Stack Software Developer specialized in engineering high-end, responsive MERN (MongoDB, Express, React, Node) SaaS architectures. With an unwavering commitment to premium user experiences and robust database race-condition protections, Iftikhar bridges high-performance backend pipelines with Apple-level visual storefronts.
            </p>

            <p className="text-[#94A3B8] font-light leading-relaxed text-sm">
              Based out of **Lahore, Pakistan**, Iftikhar designs stateless, token-rotated API services, secure payment integrations (Stripe, PayPal checkouts), and optimized visual catalogs. Every element in this platform reflects high-integrity engineering.
            </p>

            {/* Core statistics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
              <div className="bg-[#030712]/60 border border-slate-850 p-4 rounded-2xl">
                <Terminal className="w-5 h-5 text-[#8B5CF6] mb-2" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Specialty</span>
                <span className="text-sm font-extrabold text-white mt-1 block">Full-Stack MERN</span>
              </div>
              <div className="bg-[#030712]/60 border border-slate-850 p-4 rounded-2xl">
                <Code className="w-5 h-5 text-[#6366F1] mb-2" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Clean Code</span>
                <span className="text-sm font-extrabold text-white mt-1 block">SaaS Standards</span>
              </div>
              <div className="bg-[#030712]/60 border border-slate-850 p-4 rounded-2xl">
                <Cpu className="w-5 h-5 text-emerald-400 mb-2" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Systems</span>
                <span className="text-sm font-extrabold text-white mt-1 block">High Efficiency</span>
              </div>
              <div className="bg-[#030712]/60 border border-slate-850 p-4 rounded-2xl">
                <Coffee className="w-5 h-5 text-[#EC4899] mb-2" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Paces</span>
                <span className="text-sm font-extrabold text-white mt-1 block">Agile Iteration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento tech stack details */}
        <div className="space-y-6">
          <h3 className="font-display font-extrabold text-2xl text-center text-white">Technical Core Expertise</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#0F172A]/30 border border-slate-800/80 rounded-2xl p-6 text-left">
              <h4 className="font-bold text-white mb-2 text-base">Backend & APIs</h4>
              <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                Robust Express.js middleware stacks, stateless JWT double-token authentication, race-condition mitigation through Mongoose updates, and custom Winston log aggregators.
              </p>
            </div>
            
            <div className="bg-[#0F172A]/30 border border-slate-800/80 rounded-2xl p-6 text-left">
              <h4 className="font-bold text-white mb-2 text-base">Frontend & Visuals</h4>
              <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                Vite-powered modular SPA React systems, Redux-toolkit global states, premium glassmorphism layouts, custom HSL tailwind configuration, and Framer Motion micro-interactions.
              </p>
            </div>

            <div className="bg-[#0F172A]/30 border border-slate-800/80 rounded-2xl p-6 text-left">
              <h4 className="font-bold text-white mb-2 text-base">Infrastructure & Cloud</h4>
              <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                Highly resilient MongoDB Atlas cloud clusters, automated seeders with save hook slugs validation, static uploads directories, and containerized multi-service Docker configurations.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
