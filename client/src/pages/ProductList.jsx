import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import api from '../services/api.js';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for query controls
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // List arrays
  const categoriesList = ['Electronics', 'Fashion & Apparel', 'Home & Living', 'Beauty & Wellness'];

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (keyword) queryParams.set('keyword', keyword);
        if (category) queryParams.set('category', category);
        if (minPrice) queryParams.set('price[gte]', minPrice);
        if (maxPrice) queryParams.set('price[lte]', maxPrice);
        if (sort) queryParams.set('sort', sort);
        queryParams.set('page', page.toString());
        queryParams.set('limit', '6'); // 6 per page for visual layout checks

        const response = await api.get(`/products?${queryParams.toString()}`);
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.filteredProductsCount / response.data.resPerPage) || 1);
      } catch (err) {
        console.warn('API Filtered fetch failed. Loading mock catalog dataset:', err);
        // Clean developer mock dataset fallback
        setProducts([
          {
            _id: 'mock-2',
            name: 'SoundAura ANC Headphones',
            brand: 'SoundAura',
            price: 299.99,
            discountPrice: 249.99,
            ratings: 4.7,
            numReviews: 48,
            slug: 'soundaura-anc-headphones',
            category: { name: 'Electronics' },
            images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' }]
          },
          {
            _id: 'mock-3',
            name: 'Vanguard Chrono Watch',
            brand: 'Vanguard',
            price: 189.99,
            ratings: 4.6,
            numReviews: 12,
            slug: 'vanguard-chrono-sport-watch',
            category: { name: 'Fashion & Apparel' },
            images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' }]
          },
          {
            _id: 'mock-4',
            name: 'Minimalist Walnut Coffee Table',
            brand: 'WoodSmith',
            price: 450.00,
            discountPrice: 399.00,
            ratings: 4.5,
            numReviews: 8,
            slug: 'minimalist-walnut-coffee-table',
            category: { name: 'Home & Living' },
            images: [{ url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80' }]
          },
          {
            _id: 'mock-5',
            name: 'GlowElixir Vitamin C Serum',
            brand: 'GlowElixir',
            price: 49.99,
            ratings: 4.4,
            numReviews: 15,
            slug: 'glowelixir-vitamin-c-serum',
            category: { name: 'Beauty & Wellness' },
            images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' }]
          }
        ]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [keyword, category, minPrice, maxPrice, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ keyword });
    setPage(1);
  };

  const clearFilters = () => {
    setKeyword('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('-createdAt');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header and Search bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-slate-100 pb-8">
        <div className="text-left space-y-1">
          <h1 className="font-display font-extrabold text-3.5xl text-slate-900">Products Catalog</h1>
          <p className="text-slate-400 text-sm font-light">Browse the entire premium list of available electronic, apparel, and furniture SKUs.</p>
        </div>

        {/* Dynamic Search Box */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search catalog by name, brand, tags..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        </form>
      </div>

      {/* 2. Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Side filter panel */}
        <div className="space-y-6 lg:border-r lg:border-slate-100 lg:pr-8 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-950 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-700" />
              Filter By
            </h3>
            <button onClick={clearFilters} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold uppercase tracking-wider">
              Clear All
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Categories Selector */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">Categories</h4>
            <div className="flex flex-col space-y-2.5">
              {categoriesList.map((cat, idx) => (
                <label key={idx} className="flex items-center gap-2.5 cursor-pointer text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat}
                    onChange={() => { setCategory(cat); setPage(1); }}
                    className="w-4.5 h-4.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Pricing Selector */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">Price Limits (USD)</h4>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-slate-300">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Listing Products Column */}
        <div className="lg:col-span-3 space-y-8">
          {/* Sorting Selector */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
              {products.length} Products listed
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="bg-transparent text-slate-600 hover:text-slate-900 border-none font-semibold text-sm focus:outline-none cursor-pointer"
              >
                <option value="-createdAt">Newest Arrivals</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratings">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Catalog Grids */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="h-96 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
              <h3 className="font-display font-bold text-xl text-slate-800">No products found</h3>
              <p className="text-slate-400 text-sm font-light">Try adjusting your filters, search keywords, or clear filters to reset listings.</p>
              <button onClick={clearFilters} className="btn-primary py-2.5 px-6 rounded-lg text-sm font-semibold">
                Reset Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Simple Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="btn-outline px-4 py-2 text-sm rounded-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 font-semibold"
              >
                Prev Page
              </button>
              <span className="text-sm font-bold text-slate-800">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="btn-outline px-4 py-2 text-sm rounded-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 font-semibold"
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
