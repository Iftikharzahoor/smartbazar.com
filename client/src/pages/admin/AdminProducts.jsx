import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { ShoppingBag, Edit3, Trash2, Plus, X, Trash, Tag, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [featuresInput, setFeaturesInput] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  // Inline variants states
  const [variants, setVariants] = useState([]);
  const [vSize, setVSize] = useState('M');
  const [vColor, setVColor] = useState('White');
  const [vPrice, setVPrice] = useState('');
  const [vStock, setVStock] = useState('10');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.products);
      } catch (err) {
        console.warn('API fetch failed. Loading mock catalog list:', err);
        setProducts([
          { _id: 'mock-1', name: 'QuantumBook Pro 15', brand: 'QuantumTech', price: 1299.99, stock: 45, isActive: true },
          { _id: 'mock-2', name: 'SoundAura ANC Headphones', brand: 'SoundAura', price: 299.99, stock: 120, isActive: true },
          { _id: 'mock-3', name: 'Vanguard Chrono Watch', brand: 'Vanguard', price: 189.99, stock: 80, isActive: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories);
        if (response.data.categories.length > 0) {
          setCategory(response.data.categories[0]._id);
        }
      } catch (err) {
        setCategories([
          { _id: 'cat-fashion', name: 'Fashion & Apparel' },
          { _id: 'cat-electronics', name: 'Electronics' },
          { _id: 'cat-home', name: 'Home & Living' },
          { _id: 'cat-beauty', name: 'Beauty & Wellness' }
        ]);
        setCategory('cat-fashion');
      }
    };

    fetchCatalog();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product soft-deleted successfully!');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleAddVariant = () => {
    if (!vSize || !vColor || !vStock) {
      toast.error('Variant Size, Color, and Stock are required');
      return;
    }
    const newVariant = {
      size: vSize,
      color: vColor,
      price: vPrice ? Number(vPrice) : undefined,
      stock: Number(vStock)
    };
    setVariants([...variants, newVariant]);
    // Reset variant inputs
    setVPrice('');
    setVStock('10');
    toast.success(`Variant (${vSize} / ${vColor}) added to list!`);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !brand || !description || !price || !stock || !category) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      let payload;
      let headers = {};

      if (imageFile) {
        payload = new FormData();
        payload.append('name', name);
        payload.append('brand', brand);
        payload.append('description', description);
        payload.append('price', Number(price));
        payload.append('stock', Number(stock));
        payload.append('category', category);
        payload.append('features', JSON.stringify(featuresInput ? featuresInput.split(',').map(f => f.trim()).filter(Boolean) : ['Premium tailored fit', 'Exceptional comfort', 'Highly breathable fabric']));
        
        const specifications = [
          { key: 'Fabric Type', value: 'Premium Blend' },
          { key: 'Country of Origin', value: 'Pakistan' }
        ];
        payload.append('specifications', JSON.stringify(specifications));
        payload.append('variants', JSON.stringify(variants));
        payload.append('images', imageFile);

        headers = {
          'Content-Type': 'multipart/form-data'
        };
      } else {
        const images = imageUrl
          ? [{ url: imageUrl, public_id: `custom-${Date.now()}` }]
          : [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', public_id: 'default' }];

        const features = featuresInput
          ? featuresInput.split(',').map(f => f.trim()).filter(Boolean)
          : ['Premium tailored fit', 'Exceptional comfort', 'Highly breathable fabric'];

        const specifications = [
          { key: 'Fabric Type', value: 'Premium Blend' },
          { key: 'Country of Origin', value: 'Pakistan' }
        ];

        payload = {
          name,
          brand,
          description,
          price: Number(price),
          stock: Number(stock),
          category,
          images,
          features,
          specifications,
          variants
        };
      }

      const response = await api.post('/products', payload, { headers });
      if (response.data.success) {
        toast.success('Product created successfully!');
        setProducts([response.data.product, ...products]);
        setShowModal(false);
        // Clear fields
        setName('');
        setBrand('');
        setDescription('');
        setPrice('');
        setStock('');
        setImageUrl('');
        setImageFile(null);
        setFeaturesInput('');
        setVariants([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left relative">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-center border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-3.5xl text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
            Manage Products
          </h1>
          <p className="text-slate-400 text-sm font-light">Add, edit, adjust stock parameters and soft-delete catalog listings.</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary py-3 px-6 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading catalog data...</div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-xs">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-6">Brand</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-6">
                    <span className="font-bold text-slate-800 block">{product.name}</span>
                    {product.variants && product.variants.length > 0 && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold uppercase px-2 py-0.5 rounded mt-1 inline-block">
                        Variable ({product.variants.length} Variants)
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-6 text-slate-600 font-medium">{product.brand}</td>
                  <td className="py-5 px-6 text-indigo-600 font-bold">${product.price.toFixed(2)}</td>
                  <td className="py-5 px-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {product.stock} Units
                    </span>
                  </td>
                  <td className="py-5 px-6 flex items-center justify-center gap-3">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50/50 transition-colors">
                      <Edit3 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50/50 transition-colors"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 space-y-6 relative text-left">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <h3 className="font-display font-extrabold text-2xl text-slate-900 flex items-center gap-2">
                <Plus className="w-6 h-6 text-indigo-600 stroke-[3]" />
                Create New Catalog Product
              </h3>
              <p className="text-slate-400 text-xs font-light">Fill out details below to create a simple or variable fashion product.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahu Premium Polo Shirt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SahuShirts"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="49.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Stock *</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide an engaging description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upload Product Image (from PC)</label>
                  <input
                    type="file"
                    disabled={!!imageUrl}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-medium file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all disabled:opacity-40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or Image Link URL (from Web)</label>
                  <input
                    type="text"
                    disabled={!!imageFile}
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bullet Features (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 100% Cotton, Wrinkle-free, Modern Slim Fit"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                />
              </div>

              {/* Dynamic Variants Editor Section */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Tag className="w-5.5 h-5.5 text-indigo-600" />
                  <h4 className="font-bold text-sm uppercase tracking-wide">Configure Variants (Optional)</h4>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                  {/* Inline Variant Inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Variant Size</label>
                      <select
                        value={vSize}
                        onChange={(e) => setVSize(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        {['S', 'M', 'L', 'XL', 'XXL'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Variant Color</label>
                      <select
                        value={vColor}
                        onChange={(e) => setVColor(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        {['White', 'Blue', 'Black', 'Red', 'Gray', 'Pink', 'Multi'].map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Custom Price (Opt)</label>
                      <input
                        type="number"
                        placeholder="e.g. 54.99"
                        value={vPrice}
                        onChange={(e) => setVPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Variant Stock</label>
                      <input
                        type="number"
                        placeholder="10"
                        value={vStock}
                        onChange={(e) => setVStock(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="btn-secondary py-2 px-4 text-xs rounded-xl font-bold flex items-center justify-center gap-1 mx-auto"
                  >
                    <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
                    Add Variant Option
                  </button>

                  {/* Added Variants List Table */}
                  {variants.length > 0 && (
                    <div className="border border-slate-100 bg-white rounded-xl overflow-hidden mt-3 shadow-sm">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase">
                            <th className="py-2.5 px-4">Size</th>
                            <th className="py-2.5 px-4">Color</th>
                            <th className="py-2.5 px-4">Custom Price</th>
                            <th className="py-2.5 px-4">Stock</th>
                            <th className="py-2.5 px-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map((v, index) => (
                            <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                              <td className="py-2.5 px-4 font-bold text-slate-800">{v.size}</td>
                              <td className="py-2.5 px-4 font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full inline-block border border-slate-200"
                                  style={{ backgroundColor: v.color.toLowerCase() }}
                                ></span>
                                {v.color}
                              </td>
                              <td className="py-2.5 px-4 text-indigo-600 font-bold">{v.price ? `$${v.price.toFixed(2)}` : 'Base price'}</td>
                              <td className="py-2.5 px-4 text-slate-700 font-bold">{v.stock} Units</td>
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariant(index)}
                                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50/50 transition-colors"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline w-1/3 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary w-2/3 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
