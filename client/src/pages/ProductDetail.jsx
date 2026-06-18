import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { Star, ShieldCheck, Heart, Truck, Check, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItemToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [qty, setQty] = useState(1);

  // Variant selection states
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/slug/${slug}`);
        const prod = response.data.product;
        setProduct(prod);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedSize(prod.variants[0].size);
          setSelectedColor(prod.variants[0].color);
        }
      } catch (err) {
        console.warn('API fetch by slug failed. Trying ID match or mock fallback:', err);
        // Let's check if the param is actually an ID instead of a slug
        try {
          const response = await api.get(`/products/${slug}`);
          const prod = response.data.product;
          setProduct(prod);
          if (prod.variants && prod.variants.length > 0) {
            setSelectedSize(prod.variants[0].size);
            setSelectedColor(prod.variants[0].color);
          }
        } catch (idErr) {
          console.error('Product not found in database:', idErr);
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  const hasVariants = product && product.variants && product.variants.length > 0;
  const currentVariant = hasVariants && selectedSize && selectedColor
    ? product.variants.find(v => v.size === selectedSize && v.color === selectedColor)
    : null;

  const currentPrice = currentVariant && currentVariant.price !== undefined
    ? currentVariant.price 
    : (product ? (product.discountPrice || product.price) : 0);

  const currentStock = currentVariant 
    ? currentVariant.stock 
    : (product ? product.stock : 0);

  const uniqueSizes = hasVariants ? [...new Set(product.variants.map(v => v.size))] : [];
  const uniqueColors = hasVariants ? [...new Set(product.variants.map(v => v.color))] : [];

  const handleAddToCart = async () => {
    if (hasVariants && (!selectedSize || !selectedColor)) {
      toast.error('Please select both a size and a color');
      return;
    }

    if (currentStock === 0) {
      toast.error('Selected selection is currently out of stock');
      return;
    }

    // Attach custom variant properties to payload passed to hook
    const productPayload = {
      ...product,
      price: currentVariant && currentVariant.price ? currentVariant.price : product.price,
      discountPrice: currentVariant && currentVariant.price ? null : product.discountPrice
    };

    const res = await addItemToCart(productPayload, qty, selectedSize, selectedColor);
    if (res.success) {
      toast.success(`${product.name} ${selectedSize ? `(${selectedSize} ${selectedColor})` : ''} added to cart!`);
    } else {
      toast.error(res.error || 'Failed to add item');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please sign in to write a product review!');
      return;
    }

    try {
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully!');
      
      // Local append to show updates instantly
      const newReview = {
        _id: Date.now().toString(),
        name: user.name,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      setProduct(prev => ({
        ...prev,
        reviews: [newReview, ...prev.reviews],
        numReviews: prev.reviews.length + 1,
        ratings: (prev.reviews.reduce((acc, item) => item.rating + acc, rating) / (prev.reviews.length + 1))
      }));
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Review submission failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12 animate-pulse text-left">
        <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[450px] bg-slate-200 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-10 w-96 bg-slate-200 rounded-lg"></div>
            <div className="h-6 w-32 bg-slate-200 rounded-lg"></div>
            <div className="h-24 w-full bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="py-20 text-center text-slate-500 font-medium">Product details could not be found.</div>;
  }

  const alreadyReviewed = product.reviews?.some(
    r => r.user?.toString() === user?._id?.toString() || r.name === user?.name
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-left">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 font-medium">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <span className="text-slate-600 truncate">{product.name}</span>
      </nav>

      {/* 2. Overview Panel: Images and Core Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Visual Product Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <img
              src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Core Product Information Card */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{product.brand}</span>
            <h1 className="font-display font-extrabold text-3.5xl text-slate-900 leading-tight">{product.name}</h1>
            
            {/* Ratings Header */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 fill-current ${
                      i < Math.round(product.ratings) ? 'text-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700">{product.ratings.toFixed(1)}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400 font-medium">({product.numReviews} Reviews)</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Pricing Panel */}
          <div className="space-y-2">
            {product.discountPrice && !currentVariant ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-indigo-600">${product.discountPrice.toFixed(2)}</span>
                <span className="text-slate-400 text-lg line-through font-medium">${product.price.toFixed(2)}</span>
                <span className="text-xs text-rose-500 bg-rose-50 font-bold px-2 py-0.5 rounded-md">
                  SAVE ${(product.price - product.discountPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-extrabold text-slate-900">${currentPrice.toFixed(2)}</span>
            )}

            {/* Inventory Status */}
            <div className="pt-2 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentStock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {currentStock > 0 ? `In Stock (${currentStock} units available)` : 'Out of stock'}
              </span>
            </div>
          </div>

          <p className="text-slate-500 text-sm font-light leading-relaxed">{product.description}</p>

          <hr className="border-slate-100" />

          {/* Variant Selection Widgets */}
          {hasVariants && (
            <div className="space-y-4 pt-2">
              {/* Color Selector with Visual Swatches */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                  Select Color: <span className="text-slate-800 font-bold">{selectedColor}</span>
                </span>
                <div className="flex gap-2.5">
                  {uniqueColors.map(color => {
                    const cssColor = color.toLowerCase();
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          const sizeMatch = product.variants.find(v => v.color === color && v.size === selectedSize);
                          if (!sizeMatch) {
                            const anySize = product.variants.find(v => v.color === color);
                            if (anySize) setSelectedSize(anySize.size);
                          }
                        }}
                        className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === color
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-110 shadow-sm'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                        title={color}
                      >
                        <span
                          className="w-6.5 h-6.5 rounded-full block border border-slate-100"
                          style={{
                            backgroundColor: cssColor === 'multi' || cssColor === 'multicolor' 
                              ? 'transparent' 
                              : cssColor,
                            backgroundImage: cssColor === 'multi' || cssColor === 'multicolor'
                              ? 'linear-gradient(to right, red, orange, yellow, green, blue, violet)'
                              : 'none'
                          }}
                        ></span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector Buttons */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                  Select Size: <span className="text-slate-800 font-bold">{selectedSize}</span>
                </span>
                <div className="flex gap-2">
                  {uniqueSizes.map(size => {
                    const isAvailable = product.variants.some(v => v.size === size && v.color === selectedColor && v.stock > 0);
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedSize === size
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                            : isAvailable
                            ? 'border-slate-200 text-slate-700 bg-white hover:border-slate-400'
                            : 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <hr className="border-slate-100" />

          {/* Quantity Controls & Add to Cart */}
          {currentStock > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  disabled={qty === 1}
                  onClick={() => setQty(q => q - 1)}
                  className="px-4 py-2.5 text-slate-500 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-bold"
                >
                  -
                </button>
                <span className="px-6 py-2.5 text-slate-800 font-bold text-sm min-w-12 text-center">{qty}</span>
                <button
                  disabled={qty >= currentStock}
                  onClick={() => setQty(q => q + 1)}
                  className="px-4 py-2.5 text-slate-500 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 text-base shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all"
              >
                Add to Cart
              </button>
            </div>
          )}

          {/* Secure Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Truck className="w-5 h-5 text-indigo-500" />
              <span>Free Delivery (Subtotals &gt; $100)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <span>100% Encrypted Transactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Specifications Table and Reviews Form (Tabbed Menu) */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          {[
            { id: 'description', label: 'Key Features' },
            { id: 'specifications', label: 'Technical Specs' },
            { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-display font-bold text-sm transition-all focus:outline-none relative -bottom-[1px] ${
                activeTab === tab.id
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Key Bullet Features */}
        {activeTab === 'description' && (
          <div className="py-4 space-y-4 max-w-xl">
            <h4 className="font-semibold text-slate-800 text-base">Bullet Feature List</h4>
            <ul className="space-y-3">
              {product.features?.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed font-light">
                  <div className="p-0.5 bg-indigo-50 text-indigo-600 rounded-full flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 2: Specs table */}
        {activeTab === 'specifications' && (
          <div className="py-4 max-w-xl">
            <h4 className="font-semibold text-slate-800 text-base mb-4">Technical Specifications</h4>
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-sm text-left border-collapse">
                <tbody>
                  {product.specifications?.map((spec, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                      <td className="px-6 py-4 font-bold text-slate-600 w-1/3">{spec.key}</td>
                      <td className="px-6 py-4 text-slate-600 font-light">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews Submissions & List */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-4">
            {/* Reviews list */}
            <div className="space-y-6">
              <h4 className="font-semibold text-slate-800 text-base">Customer Reviews</h4>
              {product.reviews?.length === 0 ? (
                <p className="text-slate-400 text-sm font-light">No reviews submitted yet for this product. Be the first to share your thoughts!</p>
              ) : (
                <div className="space-y-6">
                  {product.reviews?.map(rev => (
                    <div key={rev._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-slate-900">{rev.name}</p>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 fill-current ${
                                i < rev.rating ? 'text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm font-light leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a review form */}
            <div>
              {alreadyReviewed ? (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 text-center space-y-2">
                  <h4 className="font-semibold text-indigo-700 text-base">Review Already Submitted</h4>
                  <p className="text-indigo-600/70 text-sm font-light">
                    You have already written a customer review for this product. ShopMERN enforces a limit of 1 review per product per user.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                  <h4 className="font-semibold text-slate-800 text-base">Write a Review</h4>
                  
                  {/* Star selector */}
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Your Score</span>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className="hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Star className={`w-6 h-6 fill-current ${num <= rating ? 'text-amber-400' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment box */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Review Details</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Share your personal experience with this product..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full py-3 text-sm font-semibold">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
