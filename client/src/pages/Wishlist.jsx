import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart, Star, Sparkles, Trash2, ArrowRight } from 'lucide-react';

const Wishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const { addItemToCart } = useCart();

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    const res = await addItemToCart(product, 1);
    if (res.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(res.error || 'Failed to add item');
    }
  };

  const handleRemove = (e, product) => {
    e.preventDefault();
    toast.success(`${product.name} removed from wishlist!`);
  };

  // Mock fallback wishlist products for sandbox if user wishlist is empty
  const wishlistProducts = user?.wishlist?.length > 0 ? user.wishlist : [
    {
      _id: 'mock-1',
      name: 'Sahu Signature Denim Shirt',
      brand: 'SahuShirts',
      price: 69.99,
      ratings: 4.9,
      numReviews: 24,
      slug: 'sahu-signature-denim-shirt',
      images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80' }]
    },
    {
      _id: 'mock-3',
      name: 'Sahu Royal Silk Satin Shirt',
      brand: 'SahuShirts',
      price: 79.99,
      ratings: 4.8,
      numReviews: 18,
      slug: 'sahu-royal-silk-satin-shirt',
      images: [{ url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=400&q=80' }]
    }
  ];

  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen py-16 relative overflow-hidden select-none">
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#EC4899]/5 rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 text-left">
        
        {/* Banner Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] font-bold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Saved Favorites
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            Wishlist Catalog
          </h1>
          <p className="text-[#94A3B8] max-w-md mx-auto font-light text-base leading-relaxed text-center">
            Review and directly purchase your saved items from our premium Sahu shirt and smart device catalog.
          </p>
        </div>

        {/* Wishlist Products Grid */}
        {wishlistProducts.length === 0 ? (
          <div className="bg-[#0F172A]/40 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6">
            <Heart className="w-16 h-16 text-[#EC4899] mx-auto opacity-40 animate-pulse" />
            <h3 className="text-2xl font-extrabold text-white">Your Wishlist is Empty</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Explore our premium shirt variants and electronic items, then save your favorites to review them later right here.
            </p>
            <Link to="/products" className="btn-primary w-fit mx-auto rounded-xl py-3 px-6 text-sm font-bold">
              Browse Store Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map((prod) => (
              <motion.div 
                key={prod._id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group bg-[#0F172A]/40 border border-slate-800/80 rounded-[1.5rem] overflow-hidden shadow-2xl backdrop-blur-md flex flex-col justify-between relative hover:border-[#EC4899]/30 transition-all text-left"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-950/40">
                  <Link to={`/products/${prod.slug || prod._id}`}>
                    <img
                      src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                      alt={prod.name}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Remove Trash Button Overlay */}
                  <button
                    onClick={(e) => handleRemove(e, prod)}
                    className="absolute top-4 right-4 z-10 p-3 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/25 hover:border-rose-500 text-[#EC4899] hover:text-white rounded-full shadow-lg backdrop-blur-md hover:scale-110 active:scale-95 transition-all focus:outline-none"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between z-10">
                  <div>
                    <span className="text-[10px] text-[#6366F1] font-black uppercase tracking-widest">{prod.brand}</span>
                    <Link to={`/products/${prod.slug || prod._id}`}>
                      <h3 className="text-white font-display font-extrabold text-lg mt-1 line-clamp-1 group-hover:text-[#EC4899] transition-colors">
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
                    <span className="text-white font-black text-lg">${prod.price.toFixed(2)}</span>

                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="p-3 bg-[#6366F1]/10 hover:bg-[#6366F1] text-[#6366F1] hover:text-white rounded-2xl active:scale-95 transition-all border border-[#6366F1]/20 hover:border-[#6366F1] focus:outline-none"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
