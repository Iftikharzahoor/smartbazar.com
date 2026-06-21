import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-indigo-500" />
              Smart<span className="text-indigo-400">Inventory</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience the pinnacle of full-stack digital retail. Beautiful design meeting secure, high-performance e-commerce mechanics.
            </p>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">SECURE CHECKOUTS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-display font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Catalog Products</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist Catalog</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-display font-semibold text-lg mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs & Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-display font-semibold text-lg mb-6">Get In Touch</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span> E-Commerce Way, Lahore Pakistan </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span>03166794173</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span>zahooriftikhar296@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-slate-800 my-12" />

        {/* Footer Base */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Smart Inventory. Built on MongoDB, Express, React, Node.</p>
          <div className="flex items-center gap-6">
            <span>Stripe Card</span>
            <span>•</span>
            <span>PayPal Express</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
