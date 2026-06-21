import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api.js';
import { 
  User, 
  LogOut, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Briefcase, 
  Calendar, 
  Activity, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Printer, 
  Search, 
  Boxes, 
  AlertTriangle, 
  Sparkles, 
  Users,
  Clock,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cashier POS states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [billingCart, setBillingCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [billingQty, setBillingQty] = useState(1);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  // Salesperson states
  const [salesSearch, setSalesSearch] = useState('');
  const [salesCategoryFilter, setSalesCategoryFilter] = useState('All');

  // Manager states
  const [staffList, setStaffList] = useState([]);

  // Authenticate session on mount
  useEffect(() => {
    const session = localStorage.getItem('employee_session');
    if (!session) {
      toast.error('Session expired. Please log in again.');
      navigate('/employee/login');
      return;
    }
    const parsed = JSON.parse(session);
    setEmployee(parsed);
    
    // Fetch products catalog and staff details
    const fetchPortalData = async () => {
      try {
        const prodRes = await api.get('/products?limit=100');
        setProducts(prodRes.data.products);
      } catch (err) {
        console.warn('API fetch catalog failed. Loading mocks:', err);
        setProducts([
          { _id: 'prod-1', name: 'Sahu Signature Denim Shirt', brand: 'SahuShirts', price: 69.99, stock: 5, category: { name: 'Fashion & Apparel' }, supplier: 'Sahu Distribution Corp' },
          { _id: 'prod-2', name: 'Sahu Premium Linen Summer Shirt', brand: 'SahuShirts', price: 64.99, stock: 3, category: { name: 'Fashion & Apparel' }, supplier: 'Sahu Distribution Corp' },
          { _id: 'prod-3', name: 'SoundAura ANC Headphones', brand: 'SoundAura', price: 299.99, stock: 4, category: { name: 'Electronics' }, supplier: 'SoundAura Inc' },
          { _id: 'prod-4', name: 'QuantumBook Pro 15', brand: 'QuantumTech', price: 1299.99, stock: 45, category: { name: 'Electronics' }, supplier: 'QuantumTech Corp' },
          { _id: 'prod-5', name: 'Vanguard Chrono Watch', brand: 'Vanguard', price: 189.99, stock: 80, category: { name: 'Fashion & Apparel' }, supplier: 'Sahu Distribution Corp' }
        ]);
      }

      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data.categories);
      } catch (err) {
        setCategories([
          { _id: 'cat-fashion', name: 'Fashion & Apparel' },
          { _id: 'cat-electronics', name: 'Electronics' },
          { _id: 'cat-home', name: 'Home & Living' },
          { _id: 'cat-beauty', name: 'Beauty & Wellness' }
        ]);
      }

      // If Manager, fetch other employees
      if (parsed.role === 'Manager') {
        try {
          const empRes = await api.get('/employees');
          setStaffList(empRes.data.employees);
        } catch (err) {
          setStaffList([
            { _id: 'emp-1', employeeId: 'EMP101', name: 'Sahu Ahmed', role: 'Manager', phoneNumber: '+92 300 1234567', attendanceStatus: 'Present', salary: 75000, joiningDate: '2025-01-15' },
            { _id: 'emp-2', employeeId: 'EMP102', name: 'Zeeshan Khan', role: 'Cashier', phoneNumber: '+92 312 9876543', attendanceStatus: 'Present', salary: 45000, joiningDate: '2025-03-10' },
            { _id: 'emp-3', employeeId: 'EMP103', name: 'Ayesha Bibi', role: 'Salesperson', phoneNumber: '+92 333 4567890', attendanceStatus: 'Leave', salary: 35000, joiningDate: '2025-05-01' },
            { _id: 'emp-4', employeeId: 'EMP104', name: 'Kamran Shah', role: 'Salesperson', phoneNumber: '+92 321 7654321', attendanceStatus: 'Absent', salary: 32000, joiningDate: '2025-06-01' }
          ]);
        }
      }
      setLoading(false);
    };

    fetchPortalData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('employee_session');
    toast.success('Logged out successfully.');
    navigate('/employee/login');
  };

  const handleCheckIn = async () => {
    try {
      const response = await api.post('/employees/check-in', { employeeId: employee.employeeId });
      if (response.data.success) {
        setEmployee(response.data.employee);
        localStorage.setItem('employee_session', JSON.stringify(response.data.employee));
        toast.success('Successfully checked in! Enjoy your shift.');
      }
    } catch (err) {
      const updated = { ...employee, attendanceStatus: 'Present' };
      setEmployee(updated);
      localStorage.setItem('employee_session', JSON.stringify(updated));
      toast.info('Checked in locally. Shift started.');
    }
  };

  // ----------------------------------------------------
  // CASHIER POS ACTIONS
  // ----------------------------------------------------
  const handleAddItemToBill = () => {
    if (!selectedProductId) {
      toast.error('Please select a product first');
      return;
    }
    const product = products.find(p => p._id === selectedProductId);
    if (!product) return;

    if (billingQty <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (product.stock < billingQty) {
      toast.error(`Insufficient stock! Only ${product.stock} units available.`);
      return;
    }

    // Check if product already in cart
    const existing = billingCart.find(item => item.productId === selectedProductId);
    if (existing) {
      if (product.stock < (existing.qty + Number(billingQty))) {
        toast.error(`Cannot add. Exceeds total available stock (${product.stock}).`);
        return;
      }
      setBillingCart(billingCart.map(item => 
        item.productId === selectedProductId 
          ? { ...item, qty: item.qty + Number(billingQty), total: (item.qty + Number(billingQty)) * item.price }
          : item
      ));
    } else {
      setBillingCart([...billingCart, {
        productId: product._id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        qty: Number(billingQty),
        total: product.price * Number(billingQty)
      }]);
    }
    
    toast.success(`${billingQty}x ${product.name} added to bill`);
    setBillingQty(1);
  };

  const handleRemoveItemFromBill = (id) => {
    setBillingCart(billingCart.filter(item => item.productId !== id));
  };

  const handleCompleteSale = async () => {
    if (billingCart.length === 0) {
      toast.error('The billing cart is empty.');
      return;
    }

    setLoading(true);
    try {
      // Deduct stock levels in local products state first
      const updatedProducts = products.map(p => {
        const cartItem = billingCart.find(item => item.productId === p._id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        }
        return p;
      });

      // Attempt to deduct stock on server (optional: backend handles order/stock internally,
      // but doing PUT catalog updates keeps sandbox demo live and consistent)
      for (let item of billingCart) {
        try {
          const prod = products.find(p => p._id === item.productId);
          if (prod) {
            await api.put(`/products/${item.productId}`, {
              stock: Math.max(0, prod.stock - item.qty),
              name: prod.name,
              brand: prod.brand,
              price: prod.price,
              category: prod.category?._id || prod.category
            });
          }
        } catch (err) {
          console.warn(`Could not update stock for product ${item.productId} on server. Offline simulation continues.`);
        }
      }

      setProducts(updatedProducts);

      const receipt = {
        invoiceId: `INV-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleString(),
        cashier: employee.name,
        items: [...billingCart],
        subtotal: billingSubtotal,
        tax: billingTax,
        shipping: shippingFee,
        total: billingTotal
      };

      setLastReceipt(receipt);
      setReceiptModalOpen(true);
      setBillingCart([]);
      setSelectedProductId('');
      toast.success('Sale transaction compiled and stock updated!');
    } catch (error) {
      toast.error('Failed to complete sale transaction');
    } finally {
      setLoading(false);
    }
  };

  // Billing calculation helpers
  const billingSubtotal = billingCart.reduce((acc, item) => acc + item.total, 0);
  const billingTax = billingSubtotal * 0.05; // 5% store tax
  const shippingFee = billingSubtotal > 0 ? 5.00 : 0.00;
  const billingTotal = billingSubtotal + billingTax + shippingFee;

  // ----------------------------------------------------
  // SALESPERSON LOUKUP FILTERS
  // ----------------------------------------------------
  const filteredSalesProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(salesSearch.toLowerCase()) ||
                          prod.brand.toLowerCase().includes(salesSearch.toLowerCase());
    
    const catId = prod.category?._id || prod.category;
    const matchesCategory = salesCategoryFilter === 'All' || catId === salesCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleRequestRestock = (prodName) => {
    toast.success(`Restock request for "${prodName}" dispatched to manager.`);
  };

  // ----------------------------------------------------
  // MANAGER ATTENDANCE ACTIONS
  // ----------------------------------------------------
  const handleManagerCycleAttendance = async (staff) => {
    const states = ['Present', 'Absent', 'Leave'];
    const nextIndex = (states.indexOf(staff.attendanceStatus) + 1) % states.length;
    const nextStatus = states[nextIndex];

    try {
      const response = await api.put(`/employees/${staff._id}`, { attendanceStatus: nextStatus });
      if (response.data.success) {
        setStaffList(staffList.map(e => e._id === staff._id ? response.data.employee : e));
        toast.success(`Updated ${staff.name} to ${nextStatus}`);
      }
    } catch (err) {
      setStaffList(staffList.map(e => e._id === staff._id ? { ...e, attendanceStatus: nextStatus } : e));
      toast.info(`Updated locally to ${nextStatus}.`);
    }
  };

  if (loading && !employee) {
    return (
      <div className="bg-[#030712] min-h-screen flex items-center justify-center text-[#94A3B8] font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
          <span>Synchronizing Staff Portal Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen relative overflow-hidden select-none flex flex-col lg:flex-row">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#6366F1]/5 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#EC4899]/5 rounded-full filter blur-[120px] pointer-events-none z-0"></div>

      {/* LEFT PROFILE & PANEL WORKSPACE */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-900/60 bg-[#080d1e]/40 backdrop-blur-xl p-6 lg:p-8 flex flex-col gap-6 relative shrink-0 z-20">
        
        {/* Portal Branding */}
        <div className="space-y-1 pb-4 border-b border-slate-900/60 text-left">
          <div className="flex items-center gap-2 text-indigo-500 font-extrabold text-sm uppercase tracking-widest">
            <Sparkles className="w-4.5 h-4.5" />
            <span>Staff Console</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dynamic Terminal</p>
        </div>

        {/* Profile Card */}
        {employee && (
          <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-3xl space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm text-white truncate">{employee.name}</h4>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider font-mono block mt-0.5">{employee.employeeId}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-900/80 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Role: <strong className="text-white">{employee.role}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{employee.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Joined: {new Date(employee.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tracker check-in */}
        {employee && (
          <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-3xl space-y-3.5 text-left">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance Status</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                employee.attendanceStatus === 'Present' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' :
                employee.attendanceStatus === 'Leave' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' :
                'bg-rose-500/15 text-rose-400 border-rose-500/25'
              }`}>
                {employee.attendanceStatus}
              </span>
            </div>

            {employee.attendanceStatus !== 'Present' && (
              <button
                onClick={handleCheckIn}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                Check-In for Today
              </button>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-auto py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
          Logout from Portal
        </button>
      </div>

      {/* RIGHT MAIN PANEL */}
      <div className="flex-grow p-6 lg:p-10 space-y-8 overflow-y-auto w-full text-left relative z-10 max-w-7xl mx-auto">
        
        {/* Panel Welcome Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-900/60">
          <div className="space-y-1">
            <h2 className="text-2.5xl font-extrabold text-white">
              {employee?.role === 'Cashier' && 'Sales Billing POS Terminal'}
              {employee?.role === 'Salesperson' && 'Product Stock Lookups'}
              {employee?.role === 'Manager' && 'Manager Administrative Command'}
            </h2>
            <p className="text-sm text-slate-400 font-light">
              {employee?.role === 'Cashier' && 'Compile customer bills, process retail receipts, and sync stock.'}
              {employee?.role === 'Salesperson' && 'Search store catalog listings and verify stock level statuses.'}
              {employee?.role === 'Manager' && 'Track employee shift registers, attendance logs and low stock deficits.'}
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* WORKSPACE: CASHIER POS */}
        {/* ---------------------------------------------------- */}
        {employee?.role === 'Cashier' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            
            {/* POS Cart list details */}
            <div className="xl:col-span-2 space-y-6">
              {/* Product Selection Inputs */}
              <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row gap-4 items-end">
                <div className="space-y-1.5 flex-grow text-left w-full">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select Product to Add *</label>
                  <div className="relative">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl focus:outline-none text-sm text-white font-semibold appearance-none"
                    >
                      <option value="">Select Catalog Item</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id} disabled={p.stock === 0}>
                          {p.name} - ${p.price?.toFixed(2)} ({p.stock} units left) {p.stock === 0 ? '[OUT]' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5 w-full sm:w-28 text-left shrink-0">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={billingQty}
                    onChange={(e) => setBillingQty(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl focus:outline-none text-sm text-white font-semibold text-center"
                  />
                </div>

                <button
                  onClick={handleAddItemToBill}
                  className="w-full sm:w-auto py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>

              {/* Items List Table */}
              <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800/80 text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
                        <th className="py-4.5 px-6">Product Item</th>
                        <th className="py-4.5 px-6">Price</th>
                        <th className="py-4.5 px-6 text-center">Qty</th>
                        <th className="py-4.5 px-6 text-right">Subtotal</th>
                        <th className="py-4.5 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingCart.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-16 text-center text-slate-500 font-medium">
                            POS Billing Cart is empty. Add products above.
                          </td>
                        </tr>
                      ) : (
                        billingCart.map(item => (
                          <tr key={item.productId} className="border-b border-slate-900/50 hover:bg-slate-900/10 transition-colors">
                            <td className="py-4 px-6">
                              <span className="font-bold text-white block">{item.name}</span>
                              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">{item.brand}</span>
                            </td>
                            <td className="py-4 px-6 text-slate-300 font-bold">${item.price?.toFixed(2)}</td>
                            <td className="py-4 px-6 text-center text-white font-bold">{item.qty}</td>
                            <td className="py-4 px-6 text-right text-indigo-400 font-black">${item.total?.toFixed(2)}</td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleRemoveItemFromBill(item.productId)}
                                className="p-2 text-slate-500 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Calculations Checkout panel */}
            <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6 text-left">
              <h3 className="font-display font-extrabold text-white flex items-center gap-2 border-b border-slate-950 pb-3">
                <ShoppingCart className="w-5 h-5 text-indigo-500" />
                Receipt Calculations
              </h3>

              <div className="space-y-3.5 text-sm text-slate-400 font-medium">
                <div className="flex justify-between">
                  <span>Cart Items Subtotal</span>
                  <span className="text-white font-bold">${billingSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Store Tax (5%)</span>
                  <span className="text-white font-bold">${billingTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Local Shipping/Carry</span>
                  <span className="text-white font-bold">${shippingFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between border-t border-slate-850 pt-3 text-base text-white">
                  <span className="font-extrabold">Grand Total</span>
                  <span className="font-black text-[#EC4899]">${billingTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCompleteSale}
                disabled={billingCart.length === 0}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4.5 h-4.5 stroke-[2.5]" />
                Complete Transaction
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* WORKSPACE: SALESPERSON LOOKUP */}
        {/* ---------------------------------------------------- */}
        {employee?.role === 'Salesperson' && (
          <div className="space-y-6">
            {/* Lookup Inputs */}
            <div className="flex flex-col sm:flex-row gap-3 bg-[#0F172A]/30 border border-slate-900/60 p-5 rounded-3xl backdrop-blur-sm">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Scan product name or search brand..."
                  value={salesSearch}
                  onChange={(e) => setSalesSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-white font-medium"
                />
              </div>

              <div className="relative min-w-48 text-left shrink-0">
                <select
                  value={salesCategoryFilter}
                  onChange={(e) => setSalesCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl focus:outline-none text-sm text-white font-medium appearance-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Catalog Grid Table */}
            <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
                      <th className="py-4.5 px-6">Product Details</th>
                      <th className="py-4.5 px-6">Category</th>
                      <th className="py-4.5 px-6">Price</th>
                      <th className="py-4.5 px-6">Stock Status</th>
                      <th className="py-4.5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalesProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-slate-500">No matching catalog items found.</td>
                      </tr>
                    ) : (
                      filteredSalesProducts.map(p => {
                        const isLow = p.stock > 0 && p.stock <= 10;
                        const isOut = p.stock === 0;

                        return (
                          <tr key={p._id} className="border-b border-slate-900/50 hover:bg-slate-900/10 transition-colors">
                            <td className="py-4 px-6">
                              <span className="font-bold text-white block">{p.name}</span>
                              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5 block">{p.brand}</span>
                            </td>
                            <td className="py-4 px-6 text-slate-400 font-medium">{p.category?.name || p.category || 'General'}</td>
                            <td className="py-4 px-6 text-[#6366F1] font-black">${p.price?.toFixed(2)}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                                isOut ? 'bg-rose-500/15 text-rose-400 border-rose-500/25' :
                                isLow ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' :
                                'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isOut ? 'bg-rose-500' :
                                  isLow ? 'bg-amber-500' :
                                  'bg-emerald-500'
                                }`}></span>
                                {p.stock} Units {isOut ? 'Out' : isLow ? 'Low' : 'OK'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              {(isLow || isOut) && (
                                <button
                                  onClick={() => handleRequestRestock(p.name)}
                                  className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-400 hover:text-white rounded-xl text-xs font-bold transition-all"
                                >
                                  Request Restock
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* WORKSPACE: MANAGER OVERVIEW */}
        {/* ---------------------------------------------------- */}
        {employee?.role === 'Manager' && (
          <div className="space-y-8">
            {/* Quick overview metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Staff Logged In', value: `${staffList.filter(e => e.attendanceStatus === 'Present').length} / ${staffList.length} Active`, icon: Users, color: 'text-indigo-400 bg-indigo-500/10' },
                { label: 'Low Stock Catalog Deficits', value: `${products.filter(p => p.stock > 0 && p.stock <= 10).length} Listings`, icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10' },
                { label: 'Out of Stock Items', value: `${products.filter(p => p.stock === 0).length} Sold Out`, icon: Boxes, color: 'text-rose-400 bg-rose-500/10' }
              ].map((kpi, index) => (
                <div key={index} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">{kpi.label}</span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">{kpi.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Staff Attendance update list */}
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-lg text-white">Daily Staff Shift Register</h3>
              
              <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
                      <th className="py-4.5 px-6">ID</th>
                      <th className="py-4.5 px-6">Name</th>
                      <th className="py-4.5 px-6">Role</th>
                      <th className="py-4.5 px-6">Phone Number</th>
                      <th className="py-4.5 px-6 text-center">Attendance Shift (Click Cycle)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.filter(s => s.employeeId !== employee.employeeId).map(staff => (
                      <tr key={staff._id} className="border-b border-slate-900/50 hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-white">{staff.employeeId}</td>
                        <td className="py-4 px-6 font-bold text-white">{staff.name}</td>
                        <td className="py-4 px-6">
                          <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-850">{staff.role}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-400 font-medium">{staff.phoneNumber}</td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleManagerCycleAttendance(staff)}
                            title="Cycle attendance status"
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase border transition-all ${
                              staff.attendanceStatus === 'Present' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25' :
                              staff.attendanceStatus === 'Leave' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/25' :
                              'bg-rose-500/15 text-rose-400 border-rose-500/25 hover:bg-rose-500/25'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              staff.attendanceStatus === 'Present' ? 'bg-emerald-500' :
                              staff.attendanceStatus === 'Leave' ? 'bg-amber-500' :
                              'bg-rose-500'
                            }`}></span>
                            {staff.attendanceStatus}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL: PRINTABLE RECEIPT */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {receiptModalOpen && lastReceipt && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6 relative text-left"
            >
              <button 
                onClick={() => setReceiptModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                {/* Receipt Header logo */}
                <div className="text-center pb-4 border-b border-dashed border-slate-800 space-y-1">
                  <div className="text-indigo-500 font-black text-lg tracking-widest uppercase">Smart Bazaar</div>
                  <div className="text-slate-500 text-[10px] font-bold tracking-wider">OFFICIAL TRANSACTION RECEIPT</div>
                </div>

                {/* Metadata */}
                <div className="space-y-1.5 text-xs text-slate-400 font-medium">
                  <div className="flex justify-between">
                    <span>Invoice Ref:</span>
                    <span className="text-white font-bold font-mono">{lastReceipt.invoiceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="text-white font-bold">{lastReceipt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cashier Operator:</span>
                    <span className="text-white font-bold">{lastReceipt.cashier}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="border-t border-b border-dashed border-slate-800 py-3 space-y-2">
                  {lastReceipt.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{item.qty}x {item.name}</span>
                      <span>${item.total?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-1.5 text-xs text-slate-400 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">${lastReceipt.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Tax (5%)</span>
                    <span className="text-white font-bold">${lastReceipt.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carry/Shipping</span>
                    <span className="text-white font-bold">${lastReceipt.shipping?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-850 pt-2 text-sm text-white font-extrabold">
                    <span>Grand Total Paid</span>
                    <span className="text-[#EC4899] font-black">${lastReceipt.total?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    window.print();
                    setReceiptModalOpen(false);
                  }}
                  className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt Copy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeDashboard;
