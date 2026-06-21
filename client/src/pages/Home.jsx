import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api.js';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  Award, 
  RotateCcw, 
  Globe, 
  Laptop, 
  Smartphone, 
  Volume2, 
  Gamepad2, 
  Home as HomeIcon, 
  Watch, 
  Play, 
  User, 
  ArrowLeftRight,
  X,
  VolumeX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [activeReel, setActiveReel] = useState(null);
  const [activeModelImageIdx, setActiveModelImageIdx] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const modelImages = [
    { url: '/user_photo.png', position: 'object-top' },
    { url: '/user_photo2.jpg', position: 'object-center' },
    { url: '/model_pakistani_boy1.png', position: 'object-center' },
    { url: '/model_pakistani_girl1.png', position: 'object-center' },
    { url: '/model_pakistani_boy2.png', position: 'object-center' },
    { url: '/model_pakistani_girl2.png', position: 'object-center' },
    { url: '/model_pakistani_boy3.png', position: 'object-center' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveModelImageIdx((prev) => (prev + 1) % modelImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeModelImageIdx]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const productReels = [
    {
      id: 'reel-1',
      title: 'Premium Fit Wear',
      description: 'Exclusive wool textures and premium fitting',
      videoUrl: '/videos/VID-20250922-WA0103.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'reel-2',
      title: 'Dior & LV Collection',
      description: 'Handcrafted luxury designer winter beanies',
      videoUrl: '/videos/VID-20250922-WA0106.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'reel-3',
      title: 'Signature Knit Styles',
      description: 'Chanel classic double knit aesthetics',
      videoUrl: '/videos/VID-20250922-WA0107.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'reel-4',
      title: 'Modern Streetwear Caps',
      description: 'Miu Miu Mohair Ribbed and Dior Oblique designs',
      videoUrl: '/videos/VID-20250922-WA0109.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=400&q=80'
    }
  ];
  
  const { addItemToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/products/featured');
        setFeaturedProducts(response.data.products);
      } catch (err) {
        console.warn('API Featured fetch failed. Loading local mock products:', err);
        // Seamless mock fallback for testing
        setFeaturedProducts([
          {
            _id: 'mock-1',
            name: 'QuantumBook Pro 15',
            brand: 'QuantumTech',
            price: 1299.99,
            discountPrice: 1199.99,
            ratings: 4.9,
            numReviews: 24,
            slug: 'quantum-book-pro-15',
            images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' }]
          },
          {
            _id: 'mock-2',
            name: 'SoundAura ANC Headphones',
            brand: 'SoundAura',
            price: 299.99,
            discountPrice: 249.99,
            ratings: 4.8,
            numReviews: 48,
            slug: 'sound-aura-anc',
            images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' }]
          },
          {
            _id: 'mock-3',
            name: 'Vanguard Chrono Watch',
            brand: 'Vanguard',
            price: 189.99,
            ratings: 4.7,
            numReviews: 12,
            slug: 'vanguard-chrono-watch',
            images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' }]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 35;
    const y = (clientY - window.innerHeight / 2) / 35;
    setMousePos({ x, y });
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    const res = await addItemToCart(product, 1);
    if (res.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(res.error || 'Failed to add item');
    }
  };

  const isWishlisted = (prodId) => user?.wishlist?.some(id => id._id === prodId || id === prodId);

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please sign in to manage your wishlist!');
      return;
    }
    toast.success(isWishlisted(product._id) ? 'Removed from wishlist!' : 'Added to wishlist!');
  };

  const categories = [
    { name: 'Smart Watches', icon: Watch, img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80', link: '/products?category=Fashion %26 Apparel' },
    { name: 'Laptops', icon: Laptop, img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80', link: '/products?category=Electronics' },
    { name: 'Smartphones', icon: Smartphone, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', link: '/products?category=Electronics' },
    { name: 'Audio', icon: Volume2, img: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80', link: '/products?category=Electronics' },
    { name: 'Gaming', icon: Gamepad2, img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80', link: '/products?category=Electronics' },
    { name: 'Smart Home', icon: HomeIcon, img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', link: '/products?category=Home %26 Living' }
  ];

  const testimonials = [
    {
      name: "Marcus Aurelius",
      role: "Lead Creative at Vercel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      content: "The QuantumBook Pro is a engineering masterpiece. The screen contrast is jaw-dropping and compile speeds are unmatched. This storefront is the Stripe of eCommerce.",
      rating: 5
    },
    {
      name: "Helena Rostova",
      role: "Senior Hardware Architect",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      content: "SoundAura ANC headphones are studio reference quality with next-gen noise-cancellation. The minimalist industrial aesthetics perfectly mirror Nothing Tech.",
      rating: 5
    },
    {
      name: "Dimitri Volk",
      role: "Founder at Linear Design",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      content: "A flawless ordering experience. Fast delivery and uncompromised build quality. These guys have established an Apple-level standard of online shopping.",
      rating: 5
    }
  ];

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className="bg-[#030712] text-[#F8FAFC] min-h-screen font-sans overflow-hidden select-none"
    >
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6366F1]/10 rounded-full filter blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/8 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-10 w-[450px] h-[450px] bg-[#EC4899]/5 rounded-full filter blur-[140px] pointer-events-none z-0"></div>

      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 lg:py-0 border-b border-slate-900 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-10 text-left"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-[#6366F1] font-semibold text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg shadow-indigo-500/5">
              <Sparkles className="w-3.5 h-3.5" />
              Technology Reimagined
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight">
              Crafted For <br />
              <span className="text-[#6366F1] bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                The Next Frontier
              </span>
            </h1>

            <p className="text-[#94A3B8] text-lg sm:text-xl font-light leading-relaxed max-w-2xl">
              Discover world-class electronics, premium wearables, smart home innovations, and next-generation gadgets designed to elevate your lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to="/products" 
                  className="w-full sm:w-auto bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all duration-300 flex items-center justify-center gap-3 text-base"
                >
                  Shop Collection
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button 
                  onClick={(e) => { e.preventDefault(); setShowDemoVideo(true); }}
                  className="w-full sm:w-auto bg-white/5 border border-white/10 hover:border-white/20 text-[#F8FAFC] font-semibold px-8 py-4 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3 text-base focus:outline-none"
                >
                  <Play className="w-4 h-4 fill-current text-white/90" />
                  Watch Demo
                </button>
              </motion.div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] tracking-wider uppercase">
                <Truck className="w-4 h-4 text-[#6366F1]" />
                ✓ Free Shipping
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
                ✓ 2-Year Warranty
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] tracking-wider uppercase">
                <Headphones className="w-4 h-4 text-[#EC4899]" />
                ✓ 24/7 Support
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-3 gap-6 max-w-lg pt-6">
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">50K+</h3>
                <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mt-1">Happy Customers</p>
              </div>
              <div className="border-l border-slate-900 pl-6">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">500+</h3>
                <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mt-1">Premium Products</p>
              </div>
              <div className="border-l border-slate-900 pl-6">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">4.9★</h3>
                <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mt-1">Customer Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Interactive 3D Product Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[500px]"
          >
            {/* Dynamic Aurora Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/20 via-[#8B5CF6]/10 to-[#EC4899]/20 filter blur-[100px] rounded-full animate-pulse"></div>

            {/* Parallax Floating Container */}
            <div 
              style={{
                transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
                transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
              className="relative w-full aspect-[4/5] max-w-[550px] flex items-center justify-center"
            >
              {/* Luxury Device Card Container */}
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] opacity-35 blur-xl"></div>
              
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative bg-[#0F172A]/85 border border-white/10 rounded-[2rem] p-6 shadow-2xl backdrop-blur-2xl w-full h-full overflow-hidden flex flex-col justify-between"
              >
                {/* Macbook Mockup Reflection / Glossy Layer */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none transform -skew-y-6"></div>

                <div className="flex justify-between items-center z-10">
                  <span className="bg-[#6366F1]/25 text-[#6366F1] font-bold text-xs px-3 py-1 rounded-full border border-[#6366F1]/30 uppercase tracking-widest">
                    Featured
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  </div>
                </div>

                <div className="relative w-full h-[450px] mt-4 overflow-hidden rounded-xl border border-slate-800 shadow-2xl z-10 group/image-container bg-[#070b15]">
                  {/* Segmented Progress Bars (Ad style) */}
                  <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-20">
                    {modelImages.map((_, idx) => (
                      <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        {activeModelImageIdx === idx ? (
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            key={activeModelImageIdx}
                            transition={{ duration: 4.5, ease: 'linear' }}
                            className="h-full bg-gradient-to-r from-[#6366F1] to-[#EC4899]"
                          />
                        ) : (
                          <div className={`h-full ${idx < activeModelImageIdx ? 'bg-[#6366F1]' : 'bg-transparent'}`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Manual Arrow Controls (Left / Right) */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveModelImageIdx((prev) => (prev - 1 + modelImages.length) % modelImages.length);
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md opacity-0 group-hover/image-container:opacity-100 transition-opacity duration-300 z-30 focus:outline-none border border-white/5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveModelImageIdx((prev) => (prev + 1) % modelImages.length);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md opacity-0 group-hover/image-container:opacity-100 transition-opacity duration-300 z-30 focus:outline-none border border-white/5"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    <motion.img
                      key={activeModelImageIdx}
                      src={modelImages[activeModelImageIdx].url}
                      alt="Smart Inventory Brand Ambassador Model"
                      initial={{ x: '100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1, y: scrollY * -0.04 }}
                      exit={{ x: '-100%', opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      className="absolute top-0 left-0 w-full h-full object-contain p-6 scale-[0.88] hover:scale-[0.92] transition-all duration-500"
                    />
                  </AnimatePresence>

                  {/* Pagination Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                    {modelImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveModelImageIdx(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                          activeModelImageIdx === idx 
                            ? 'bg-white w-4' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-left z-10">
                  <h3 className="text-xl font-extrabold text-white">Sahu Premium Linen Summer Shirt</h3>
                  <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                    Worn by our Lead Brand Ambassador. Ultra-breathable, certified organic European summer linen.
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="text-[#EC4899] font-black text-lg">$64.99</span>
                    <Link to="/products/sahu-premium-linen-summer-shirt" className="text-xs text-[#6366F1] font-semibold hover:text-[#8B5CF6] transition-colors flex items-center gap-1">
                      Configure Fit
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Floating micro glass-cards around product */}
              <motion.div 
                animate={{ y: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -top-6 -left-12 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl z-20 flex items-center gap-2.5 text-xs text-white"
              >
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
                <span className="font-semibold text-white/90">✦ 100% French Silk</span>
              </motion.div>

              <motion.div 
                animate={{ y: [8, -8, 8] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -right-12 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl z-20 flex items-center gap-2.5 text-xs text-white"
              >
                <Zap className="w-4 h-4 text-[#8B5CF6] animate-bounce" />
                <span className="font-semibold text-white/90">⚡ Four-Way Stretch Tech</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="relative py-24 sm:py-32 border-b border-slate-900 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] font-semibold text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full"
          >
            Collections
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">Featured Categories</h2>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base">Select your target category to narrow down your next premium tech listing.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  to={cat.link}
                  className="group relative overflow-hidden rounded-[1.5rem] h-72 border border-slate-800/80 bg-[#0F172A]/50 block shadow-xl hover:shadow-2xl hover:shadow-[#6366F1]/5 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/30 to-transparent z-10"></div>
                  
                  {/* Subtle Accent Glow Border */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/10 to-[#EC4899]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Category Card Header Details */}
                  <div className="absolute top-6 right-6 z-20 bg-black/45 backdrop-blur-md p-3 rounded-2xl border border-white/5">
                    <IconComponent className="w-5 h-5 text-[#8B5CF6]" />
                  </div>

                  <div className="absolute bottom-6 left-6 z-20 text-left">
                    <h3 className="text-white font-display font-extrabold text-2xl group-hover:text-[#6366F1] transition-colors">{cat.name}</h3>
                    <span className="text-[#94A3B8] text-xs font-semibold uppercase tracking-widest mt-1 block">Explore Gear →</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* BEST SELLERS SECTION */}
      <section id="best-sellers" className="relative py-24 sm:py-32 border-b border-slate-900 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] font-semibold text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full">
            Curated Gear
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">Best Sellers</h2>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base">Explore top-rated, handpicked devices and luxury apparel in heavy demand.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-[430px] rounded-[1.5rem] bg-[#0F172A]/40 border border-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((prod) => {
              const wishlisted = isWishlisted(prod._id);
              return (
                <motion.div 
                  key={prod._id}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-[#0F172A]/40 rounded-[1.5rem] border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col justify-between relative hover:border-[#6366F1]/30 transition-all"
                >
                  {/* Glowing Overlay inside card on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div className="relative aspect-square w-full overflow-hidden bg-slate-950/40">
                    {prod.discountPrice && (
                      <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full shadow-lg">
                        SALE
                      </span>
                    )}

                    <Link to={`/products/${prod.slug || prod._id}`}>
                      <img
                        src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                        alt={prod.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>

                    {/* Wishlist button */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, prod)}
                      className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg backdrop-blur-md hover:scale-110 active:scale-95 transition-all focus:outline-none border ${
                        wishlisted
                          ? 'bg-rose-500/20 text-[#EC4899] border-rose-500/30'
                          : 'bg-black/35 text-slate-400 hover:text-white border-white/5'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Info Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between z-10">
                    <div>
                      <span className="text-[10px] text-[#6366F1] font-black uppercase tracking-widest">{prod.brand}</span>
                      <Link to={`/products/${prod.slug || prod._id}`}>
                        <h3 className="text-white font-display font-extrabold text-lg mt-1 line-clamp-1 group-hover:text-[#6366F1] transition-colors">
                          {prod.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 fill-current ${
                                i < Math.round(prod.ratings) ? 'text-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#94A3B8] font-semibold">({prod.numReviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 border-t border-slate-800/80 pt-4">
                      <div className="flex flex-col">
                        {prod.discountPrice ? (
                          <div className="flex items-center gap-2.5">
                            <span className="text-[#EC4899] font-black text-lg">${prod.discountPrice.toFixed(2)}</span>
                            <span className="text-slate-500 text-xs line-through font-light">${prod.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-white font-black text-lg">${prod.price.toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, prod)}
                        className="p-3 bg-[#6366F1]/10 hover:bg-[#6366F1] text-[#6366F1] hover:text-white rounded-2xl active:scale-95 transition-all border border-[#6366F1]/20 hover:border-[#6366F1] focus:outline-none"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* SMART INVENTORY LIVE - PREMIUM REELS SECTION */}
      <section className="relative py-24 border-b border-slate-900 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] font-semibold text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full">
            Smart Inventory Live
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">Product Reels</h2>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base">Watch our luxury apparel and caps in action. Click any card to play in high quality with audio!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productReels.map((reel) => (
            <motion.div
              key={reel.id}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => setActiveReel(reel)}
              className="group relative overflow-hidden rounded-[2rem] aspect-[9/16] bg-[#0F172A]/50 border border-slate-800/80 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              {/* Cover Image fallback */}
              <div className="absolute inset-0 bg-slate-950/60 z-10 flex flex-col justify-between p-6">
                <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 tracking-widest w-fit flex items-center gap-1.5 uppercase">
                  <span className="w-2.5 h-2.5 bg-[#EC4899] rounded-full animate-ping"></span>
                  LIVE DEMO
                </span>
                
                <div className="text-left space-y-2 z-20">
                  <h3 className="text-white font-extrabold text-xl group-hover:text-[#6366F1] transition-colors">{reel.title}</h3>
                  <p className="text-[#94A3B8] text-xs font-light line-clamp-2">{reel.description}</p>
                  <span className="text-xs text-[#6366F1] font-semibold flex items-center gap-1 mt-2">
                    Watch Reel <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>

              {/* Silent Looping Hover Video */}
              <video
                src={reel.videoUrl}
                loop
                muted
                playsInline
                autoPlay
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 pointer-events-none"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US (BENTO GRID) */}
      <section className="relative py-24 sm:py-32 border-b border-slate-900 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] font-semibold text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full">
            Our Standard
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">Why Choose Us</h2>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base">Uncompromising quality built directly into every single step of your buying lifecycle.</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          
          {/* Card 1: Fast Delivery (Large / Glowing) */}
          <div className="md:col-span-4 bg-[#0F172A]/50 border border-slate-800 rounded-[1.5rem] p-8 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/10 rounded-full filter blur-3xl pointer-events-none transition-opacity group-hover:bg-[#6366F1]/15"></div>
            
            <div className="space-y-4 text-left z-10">
              <div className="p-3 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] rounded-2xl w-fit">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Next-Day Air Shipping</h3>
              <p className="text-[#94A3B8] font-light leading-relaxed max-w-xl text-sm">
                Get your premium tech delivered in under 24 hours with our global logistics partnerships. Real-time GPS tracking and signature delivery guaranteed on all shipments.
              </p>
            </div>
            
            <div className="pt-8 flex items-center gap-6 z-10">
              <div className="flex -space-x-3">
                <img className="w-8 h-8 rounded-full border-2 border-[#030712] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="Courier Avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-[#030712] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" alt="Courier Avatar" />
              </div>
              <span className="text-xs text-[#6366F1] font-semibold">180+ Countries Covered Successfully</span>
            </div>
          </div>

          {/* Card 2: Secure Payment */}
          <div className="md:col-span-2 bg-[#0F172A]/50 border border-slate-800 rounded-[1.5rem] p-8 flex flex-col justify-between overflow-hidden relative group">
            <div className="space-y-4 text-left z-10">
              <div className="p-3 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] rounded-2xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Secure Encrypted Payments</h3>
              <p className="text-[#94A3B8] font-light leading-relaxed text-sm">
                Rest easy knowing your financial transactions are secured using industry-standard AES-256 SSL checkouts, fully powered by Stripe & PayPal integrations.
              </p>
            </div>
            <div className="pt-6 flex justify-start items-center gap-3 z-10">
              <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-2.5 py-1 rounded-md">PCI-DSS LEVEL 1</span>
              <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-2.5 py-1 rounded-md">3D SECURE 2.0</span>
            </div>
          </div>

          {/* Card 3: Premium Quality */}
          <div className="md:col-span-2 bg-[#0F172A]/50 border border-slate-800 rounded-[1.5rem] p-8 flex flex-col justify-between overflow-hidden relative group">
            <div className="space-y-4 text-left z-10">
              <div className="p-3 bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] rounded-2xl w-fit">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Uncompromised Quality</h3>
              <p className="text-[#94A3B8] font-light leading-relaxed text-sm">
                Every gadget and apparel item in our catalog undergoes rigorous 12-point quality and texture audits to guarantee high durability and aesthetic superiority.
              </p>
            </div>
            <span className="text-left text-xs font-semibold text-[#EC4899] tracking-wider uppercase z-10 mt-6">✧ 100% Quality Inspected</span>
          </div>

          {/* Card 4: Easy Returns */}
          <div className="md:col-span-2 bg-[#0F172A]/50 border border-slate-800 rounded-[1.5rem] p-8 flex flex-col justify-between text-left group">
            <div className="space-y-4">
              <div className="p-3 bg-white/5 border border-white/10 text-white rounded-2xl w-fit">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Hassle-Free 30-Day Returns</h3>
              <p className="text-[#94A3B8] font-light leading-relaxed text-xs">
                Not fully satisfied with your device? Return it within 30 days for a 100% immediate cashback refund, no questions asked.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-4">✓ Full Cashbacks</span>
          </div>

          {/* Card 5: Global Shipping */}
          <div className="md:col-span-2 bg-[#0F172A]/50 border border-slate-800 rounded-[1.5rem] p-8 flex flex-col justify-between text-left group">
            <div className="space-y-4">
              <div className="p-3 bg-white/5 border border-white/10 text-white rounded-2xl w-fit">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Worldwide Delivery</h3>
              <p className="text-[#94A3B8] font-light leading-relaxed text-xs">
                We handle air and ocean shipments worldwide, partnering with premium carriers to reach over 180 countries successfully.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-4">✓ Local Carrier Handoff</span>
          </div>

          {/* Card 6: 24/7 Expert Support (Large / Accent) */}
          <div className="md:col-span-6 bg-[#0F172A]/50 border border-slate-800 rounded-[1.5rem] p-8 flex flex-col md:flex-row justify-between items-start md:items-center overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#EC4899]/5 rounded-full filter blur-3xl pointer-events-none"></div>
            
            <div className="space-y-4 text-left z-10 max-w-2xl">
              <div className="p-3 bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] rounded-2xl w-fit">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">24/7 Professional Engineering Support</h3>
              <p className="text-[#94A3B8] font-light leading-relaxed text-sm">
                Connect with our dedicated in-house tech support engineers anytime. Average queue response time is under 2 minutes, supporting live ticket updates and hardware configurations.
              </p>
            </div>

            <div className="pt-6 md:pt-0 z-10 flex flex-col items-center justify-center bg-black/45 border border-white/5 rounded-3xl p-5 backdrop-blur-md">
              <div className="flex -space-x-2">
                <img className="w-10 h-10 rounded-full border-2 border-[#0F172A] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" alt="Tech Agent" />
                <img className="w-10 h-10 rounded-full border-2 border-[#0F172A] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" alt="Tech Agent" />
              </div>
              <span className="text-[10px] text-green-400 font-bold tracking-widest mt-2 flex items-center gap-1.5 uppercase">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                ACTIVE ON CALL
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative py-24 sm:py-32 border-b border-slate-900 z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] font-semibold text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full">
            Client Voices
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">Testimonials</h2>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base">Read direct experiences from leading designers, creators, and engineering architects.</p>
        </div>

        {/* Dynamic Slide Card Container */}
        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTestimonial}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.5 }}
              className="bg-[#0F172A]/70 border border-slate-800 rounded-[2rem] p-10 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden text-left"
            >
              {/* Glossy Backdrop Overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366F1]/5 rounded-full filter blur-2xl"></div>

              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-white text-lg md:text-xl font-light leading-relaxed italic">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4">
                    <img 
                      src={testimonials[activeTestimonial].avatar} 
                      alt={testimonials[activeTestimonial].name} 
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/25"
                    />
                    <div>
                      <h4 className="font-extrabold text-white text-base">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {testimonials.map((_, index) => (
            <button 
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 focus:outline-none ${
                activeTestimonial === index 
                  ? 'bg-[#6366F1] scale-125 shadow-lg shadow-indigo-600/30' 
                  : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="relative py-24 sm:py-32 z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden p-12 text-center border border-slate-800 bg-[#0F172A]/40 shadow-2xl backdrop-blur-3xl">
          {/* Neon Gradient Radial Glowing Base */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/10 via-[#8B5CF6]/5 to-[#EC4899]/10 pointer-events-none"></div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#6366F1]/10 rounded-full filter blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#EC4899]/5 rounded-full filter blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] font-semibold text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full">
              Instant Rewards
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">Unlock Premium Access</h2>
            <p className="text-[#94A3B8] max-w-lg mx-auto font-light text-base leading-relaxed">
              Subscribe to the ShopMERN exclusive newsletter and receive up to 10% instant promo vouchers for your first hardware order!
            </p>
            
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-4">
              <input
                type="email"
                placeholder="Enter email address"
                required
                className="flex-1 px-5 py-4 bg-slate-950/80 border border-slate-800 rounded-2xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-white placeholder-slate-500 text-sm font-medium transition-all"
              />
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white font-semibold px-6 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 text-sm"
              >
                Join Inner Circle
              </motion.button>
            </form>
          </div>
        </div>
      </section>

      {/* VIDEO OVERLAY MODALS */}
      <AnimatePresence>
        {/* 1. HERO DEMO MODAL */}
        {showDemoVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-[#0F172A]/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-4 md:p-6 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDemoVideo(false)}
                className="absolute top-6 right-6 z-50 p-3 bg-black/55 text-white hover:text-[#EC4899] rounded-full border border-white/10 hover:scale-110 active:scale-95 transition-all focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full rounded-[1.8rem] overflow-hidden border border-white/5 shadow-2xl bg-black">
                <video
                  src="/videos/VID-20250922-WA0103.mp4"
                  autoPlay
                  controls
                  loop
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white font-extrabold text-2xl mt-6">Smart Inventory Luxury Collection</h3>
              <p className="text-[#94A3B8] font-light text-sm mt-1">Exquisite fabric textures, organic materials, and flawless tailored fits designed for the next frontier.</p>
            </motion.div>
          </motion.div>
        )}

        {/* 2. REEL PREVIEW MODAL (TikTok/Reels vertical player) */}
        {activeReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md aspect-[9/16] max-h-[85vh] bg-[#0F172A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Video Player */}
              <video
                src={activeReel.videoUrl}
                autoPlay
                controls
                loop
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Glass Header controls */}
              <div className="relative z-10 w-full p-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <span className="bg-indigo-500/25 text-[#6366F1] font-bold text-[10px] px-3 py-1 rounded-full border border-[#6366F1]/30 uppercase tracking-widest">
                  Live Showcase
                </span>
                <button
                  onClick={() => setActiveReel(null)}
                  className="p-2.5 bg-black/45 text-white hover:text-[#EC4899] rounded-full border border-white/10 hover:scale-110 active:scale-95 transition-all focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Glass Bottom Info Overlay */}
              <div className="relative z-10 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent space-y-3 text-left">
                <h3 className="text-white font-extrabold text-xl">{activeReel.title}</h3>
                <p className="text-white/80 font-light text-xs leading-relaxed">{activeReel.description}</p>
                <div className="flex gap-3 pt-2">
                  <Link
                    to="/products"
                    onClick={() => setActiveReel(null)}
                    className="flex-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white font-semibold text-xs text-center py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    Shop Collection
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
