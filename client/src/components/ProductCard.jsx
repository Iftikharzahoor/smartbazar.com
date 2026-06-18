import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addItemToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const res = await addItemToCart(product, 1);
    if (res.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(res.error || 'Failed to add item');
    }
  };

  const isWishlisted = user?.wishlist?.some(id => id._id === product._id || id === product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please sign in to manage your wishlist!');
      return;
    }
    toast.success(isWishlisted ? 'Removed from wishlist!' : 'Added to wishlist!');
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover-premium flex flex-col justify-between">
      {/* Badge & Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        {product.discountPrice && (
          <span className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
            SALE
          </span>
        )}
        <Link to={`/products/${product.slug || product._id}`}>
          <img
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Heart Wishlist Overlay */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all focus:outline-none ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 border border-rose-100'
              : 'bg-white text-slate-400 hover:text-rose-500 border border-slate-100'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 stroke-rose-500' : 'stroke-slate-400'}`} />
        </button>
      </div>

      {/* Description Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{product.brand}</span>
          <Link to={`/products/${product.slug || product._id}`}>
            <h3 className="text-slate-800 font-semibold text-base mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Ratings Star Display */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 fill-current ${
                    i < Math.round(product.ratings) ? 'text-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 font-medium">({product.numReviews})</span>
          </div>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="flex items-center justify-between mt-5 border-t border-slate-50 pt-4">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold text-lg">${product.discountPrice.toFixed(2)}</span>
                <span className="text-slate-400 text-sm line-through">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-slate-900 font-bold text-lg">${product.price.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl active:scale-95 transition-all shadow-sm focus:outline-none"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
