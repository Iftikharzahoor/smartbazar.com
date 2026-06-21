import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api.js';
import { 
  DollarSign, 
  FileText, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  UserPlus, 
  Briefcase, 
  Phone, 
  Calendar, 
  Boxes, 
  Activity, 
  Info, 
  X, 
  ChevronDown, 
  Settings, 
  Shield, 
  UserMinus, 
  Mail, 
  MapPin, 
  Menu,
  CreditCard,
  Check
} from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mobile navigation drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Read LocalStorage store settings on startup
  const [storeSettings, setStoreSettings] = useState({
    storeName: localStorage.getItem('smart_inventory_name') || 'Smart Inventory',
    currencySymbol: localStorage.getItem('smart_inventory_currency') || '$',
    lowStockThreshold: Number(localStorage.getItem('smart_inventory_low_stock_threshold')) || 10,
    storeEmail: localStorage.getItem('smart_inventory_email') || 'contact@smartbazaar.com',
    shippingFee: Number(localStorage.getItem('smart_inventory_shipping')) || 5.00
  });

  // Overall Dashboard Summary Stats State
  const [stats, setStats] = useState({
    totalRevenue: 28450.99,
    totalOrders: 154,
    totalProducts: 45,
    totalUsers: 88,
    inStockCount: 32,
    outOfStockCount: 5,
    lowStockCount: 8,
    totalEmployees: 4,
    presentEmployees: 2,
    recentOrders: [],
    lowStockAlerts: []
  });

  // Data lists states
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Search & Filter states - Employees
  const [empSearch, setEmpSearch] = useState('');
  const [empRoleFilter, setEmpRoleFilter] = useState('All');
  const [empAttendanceFilter, setEmpAttendanceFilter] = useState('All');

  // Search & Filter states - Stock
  const [stockSearch, setStockSearch] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('All');

  // Search & Filter states - Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Search & Filter states - Users
  const [userSearch, setUserSearch] = useState('');

  // Modal control states
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states - Employee
  const [empForm, setEmpForm] = useState({
    employeeId: '',
    name: '',
    role: 'Salesperson',
    phoneNumber: '',
    attendanceStatus: 'Present',
    salary: '',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  // Form states - Product
  const [prodForm, setProdForm] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    category: '',
    supplier: 'Sahu Distribution Corp',
    description: '',
    imageUrl: '',
    imageFile: null,
    featuresInput: '',
    variants: []
  });

  // Variant helper states
  const [vSize, setVSize] = useState('M');
  const [vColor, setVColor] = useState('White');
  const [vPrice, setVPrice] = useState('');
  const [vStock, setVStock] = useState('10');

  // Sync active view/tab based on routing path
  const getTabFromPath = (path) => {
    if (path === '/admin/employees') return 'employees';
    if (path === '/admin/products') return 'stock';
    if (path === '/admin/orders') return 'orders';
    if (path === '/admin/users') return 'users';
    if (path === '/admin/settings') return 'settings';
    return 'overview';
  };

  const activeTab = getTabFromPath(location.pathname);

  // Load dashboard data
  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch dashboard summaries
      let summaryStats;
      try {
        const response = await api.get('/orders/stats/summary');
        summaryStats = response.data;
      } catch (err) {
        console.warn('API stats summary failed. Loading mock stats:', err);
        summaryStats = {
          totalRevenue: 28450.99,
          totalOrders: 154,
          totalProducts: 45,
          totalUsers: 88,
          inStockCount: 32,
          outOfStockCount: 5,
          lowStockCount: 8,
          totalEmployees: 4,
          presentEmployees: 2,
          recentOrders: [
            { _id: 'o-101', user: { name: 'John Doe' }, totalPrice: 249.99, status: 'processing', createdAt: new Date().toISOString() },
            { _id: 'o-102', user: { name: 'Alice Smith' }, totalPrice: 1199.99, status: 'delivered', createdAt: new Date().toISOString() },
            { _id: 'o-103', user: { name: 'Bob Johnson' }, totalPrice: 189.99, status: 'pending', createdAt: new Date().toISOString() }
          ],
          lowStockAlerts: [
            { _id: 'p-1', name: 'Sahu Signature Denim Shirt', stock: 5, price: 69.99, brand: 'SahuShirts' },
            { _id: 'p-2', name: 'Sahu Premium Linen Summer Shirt', stock: 3, price: 64.99, brand: 'SahuShirts' },
            { _id: 'p-3', name: 'SoundAura ANC Headphones', stock: 4, price: 299.99, brand: 'SoundAura' }
          ]
        };
      }
      setStats(summaryStats);

      // 2. Fetch employees
      try {
        const response = await api.get('/employees');
        setEmployees(response.data.employees);
      } catch (err) {
        console.warn('API fetch employees failed. Loading mock employees:', err);
        setEmployees([
          { _id: 'emp-1', employeeId: 'EMP101', name: 'Sahu Ahmed', role: 'Manager', phoneNumber: '+92 300 1234567', attendanceStatus: 'Present', salary: 75000, joiningDate: '2025-01-15' },
          { _id: 'emp-2', employeeId: 'EMP102', name: 'Zeeshan Khan', role: 'Cashier', phoneNumber: '+92 312 9876543', attendanceStatus: 'Present', salary: 45000, joiningDate: '2025-03-10' },
          { _id: 'emp-3', employeeId: 'EMP103', name: 'Ayesha Bibi', role: 'Salesperson', phoneNumber: '+92 333 4567890', attendanceStatus: 'Leave', salary: 35000, joiningDate: '2025-05-01' },
          { _id: 'emp-4', employeeId: 'EMP104', name: 'Kamran Shah', role: 'Salesperson', phoneNumber: '+92 321 7654321', attendanceStatus: 'Absent', salary: 32000, joiningDate: '2025-06-01' }
        ]);
      }

      // 3. Fetch categories
      let catsList = [];
      try {
        const response = await api.get('/categories');
        catsList = response.data.categories;
        setCategories(catsList);
      } catch (err) {
        catsList = [
          { _id: 'cat-fashion', name: 'Fashion & Apparel' },
          { _id: 'cat-electronics', name: 'Electronics' },
          { _id: 'cat-home', name: 'Home & Living' },
          { _id: 'cat-beauty', name: 'Beauty & Wellness' }
        ];
        setCategories(catsList);
      }

      // 4. Fetch products
      try {
        const response = await api.get('/products?limit=100');
        setProducts(response.data.products);
      } catch (err) {
        console.warn('API fetch products failed. Loading mock catalog products:', err);
        setProducts([
          { _id: 'prod-1', name: 'Sahu Signature Denim Shirt', brand: 'SahuShirts', price: 69.99, stock: 5, category: { _id: 'cat-fashion', name: 'Fashion & Apparel' }, supplier: 'Sahu Distribution Corp' },
          { _id: 'prod-2', name: 'Sahu Premium Linen Summer Shirt', brand: 'SahuShirts', price: 64.99, stock: 3, category: { _id: 'cat-fashion', name: 'Fashion & Apparel' }, supplier: 'Sahu Distribution Corp' },
          { _id: 'prod-3', name: 'SoundAura ANC Headphones', brand: 'SoundAura', price: 299.99, stock: 4, category: { _id: 'cat-electronics', name: 'Electronics' }, supplier: 'SoundAura Inc' },
          { _id: 'prod-4', name: 'QuantumBook Pro 15', brand: 'QuantumTech', price: 1299.99, stock: 45, category: { _id: 'cat-electronics', name: 'Electronics' }, supplier: 'QuantumTech Corp' },
          { _id: 'prod-5', name: 'Vanguard Chrono Watch', brand: 'Vanguard', price: 189.99, stock: 80, category: { _id: 'cat-fashion', name: 'Fashion & Apparel' }, supplier: 'Sahu Distribution Corp' }
        ]);
      }

      // 5. Fetch orders
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders);
      } catch (err) {
        console.warn('API fetch orders failed. Loading mock orders list:', err);
        setOrders([
          { _id: 'o-101', user: { name: 'John Doe', email: 'customer@shopmern.com' }, totalPrice: 249.99, status: 'processing', isPaid: true, createdAt: new Date().toISOString() },
          { _id: 'o-102', user: { name: 'Alice Smith', email: 'alice@shopmern.com' }, totalPrice: 1199.99, status: 'delivered', isPaid: true, createdAt: new Date().toISOString() },
          { _id: 'o-103', user: { name: 'Bob Johnson', email: 'bob@shopmern.com' }, totalPrice: 189.99, status: 'pending', isPaid: false, createdAt: new Date().toISOString() }
        ]);
      }

      // 6. Fetch users
      try {
        const response = await api.get('/users');
        setUsersList(response.data.users);
      } catch (err) {
        console.warn('API fetch users failed. Loading mock users list:', err);
        setUsersList([
          { _id: 'u-1', name: 'Fatima Khan', email: 'fatima@shopmern.com', role: 'user' },
          { _id: 'u-2', name: 'Iftikhar Zahoor', email: 'zahooriftikhar296@gmail.com', role: 'admin' },
          { _id: 'u-3', name: 'Zeeshan Ahmad', email: 'zeeshan@shopmern.com', role: 'user' }
        ]);
      }
    } catch (error) {
      toast.error('Error fetching dashboard database registries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [location.pathname]);

  // Update employee statistics counts locally on CRUD operations
  const updateStatsLocal = (newEmployeesList) => {
    const total = newEmployeesList.length;
    const present = newEmployeesList.filter(e => e.attendanceStatus === 'Present').length;
    setStats(prev => ({
      ...prev,
      totalEmployees: total,
      presentEmployees: present
    }));
  };

  // Update product stock counts locally on CRUD operations
  const updateStockStatsLocal = (newProductsList) => {
    const total = newProductsList.length;
    const limitThresh = storeSettings.lowStockThreshold;
    const inStock = newProductsList.filter(p => p.stock > limitThresh).length;
    const lowStock = newProductsList.filter(p => p.stock > 0 && p.stock <= limitThresh).length;
    const outOfStock = newProductsList.filter(p => p.stock === 0).length;
    setStats(prev => ({
      ...prev,
      totalProducts: total,
      inStockCount: inStock,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock
    }));
  };

  // ----------------------------------------------------
  // EMPLOYEE CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setEmpForm({
      employeeId: `EMP${101 + employees.length}`,
      name: '',
      role: 'Salesperson',
      phoneNumber: '',
      attendanceStatus: 'Present',
      salary: '',
      joiningDate: new Date().toISOString().split('T')[0]
    });
    setEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp) => {
    setEditingEmployee(emp);
    setEmpForm({
      employeeId: emp.employeeId,
      name: emp.name,
      role: emp.role,
      phoneNumber: emp.phoneNumber,
      attendanceStatus: emp.attendanceStatus,
      salary: emp.salary,
      joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : ''
    });
    setEmployeeModalOpen(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!empForm.employeeId || !empForm.name || !empForm.phoneNumber || !empForm.salary) {
      toast.error('All fields marked * are required');
      return;
    }

    try {
      if (editingEmployee) {
        const response = await api.put(`/employees/${editingEmployee._id}`, empForm);
        if (response.data.success) {
          toast.success('Employee record updated successfully!');
          const updated = employees.map(emp => emp._id === editingEmployee._id ? response.data.employee : emp);
          setEmployees(updated);
          updateStatsLocal(updated);
        }
      } else {
        const response = await api.post('/employees', empForm);
        if (response.data.success) {
          toast.success('Employee registered successfully!');
          const updated = [response.data.employee, ...employees];
          setEmployees(updated);
          updateStatsLocal(updated);
        }
      }
      setEmployeeModalOpen(false);
    } catch (err) {
      const fallbackEmp = {
        _id: editingEmployee?._id || `emp-${Date.now()}`,
        ...empForm,
        salary: Number(empForm.salary)
      };
      
      let updated;
      if (editingEmployee) {
        updated = employees.map(emp => emp._id === editingEmployee._id ? fallbackEmp : emp);
      } else {
        updated = [fallbackEmp, ...employees];
      }
      setEmployees(updated);
      updateStatsLocal(updated);
      toast.info('Local employee cache updated.');
      setEmployeeModalOpen(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee record?')) return;
    try {
      await api.delete(`/employees/${id}`);
      toast.success('Employee deleted successfully.');
      const updated = employees.filter(emp => emp._id !== id);
      setEmployees(updated);
      updateStatsLocal(updated);
    } catch (err) {
      const updated = employees.filter(emp => emp._id !== id);
      setEmployees(updated);
      updateStatsLocal(updated);
      toast.info('Deleted from local mock cache.');
    }
  };

  const handleToggleAttendance = async (emp) => {
    const states = ['Present', 'Absent', 'Leave'];
    const nextIndex = (states.indexOf(emp.attendanceStatus) + 1) % states.length;
    const nextStatus = states[nextIndex];

    try {
      const response = await api.put(`/employees/${emp._id}`, { attendanceStatus: nextStatus });
      if (response.data.success) {
        const updated = employees.map(e => e._id === emp._id ? response.data.employee : e);
        setEmployees(updated);
        updateStatsLocal(updated);
        toast.success(`Attendance toggled to ${nextStatus}`);
      }
    } catch (err) {
      const updated = employees.map(e => e._id === emp._id ? { ...e, attendanceStatus: nextStatus } : e);
      setEmployees(updated);
      updateStatsLocal(updated);
      toast.info(`Attendance set to ${nextStatus} locally.`);
    }
  };

  // ----------------------------------------------------
  // PRODUCT CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      brand: '',
      price: '',
      stock: '',
      category: categories.length > 0 ? categories[0]._id : '',
      supplier: 'Sahu Distribution Corp',
      description: '',
      imageUrl: '',
      imageFile: null,
      featuresInput: '',
      variants: []
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      stock: prod.stock,
      category: prod.category?._id || prod.category || '',
      supplier: prod.supplier || 'Sahu Distribution Corp',
      description: prod.description || '',
      imageUrl: prod.images?.[0]?.url || '',
      imageFile: null,
      featuresInput: prod.features ? prod.features.join(', ') : '',
      variants: prod.variants || []
    });
    setProductModalOpen(true);
  };

  const handleAddVariantOption = () => {
    if (!vSize || !vColor || !vStock) {
      toast.error('Size, Color, and Stock quantity are required');
      return;
    }
    const newVariant = {
      size: vSize,
      color: vColor,
      price: vPrice ? Number(vPrice) : undefined,
      stock: Number(vStock)
    };
    setProdForm(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
    setVPrice('');
    toast.success('Variant registered');
  };

  const handleRemoveVariantOption = (idx) => {
    setProdForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.brand || !prodForm.price || !prodForm.stock || !prodForm.category) {
      toast.error('All required fields * must be filled');
      return;
    }

    try {
      let payload;
      let headers = {};

      if (prodForm.imageFile) {
        payload = new FormData();
        payload.append('name', prodForm.name);
        payload.append('brand', prodForm.brand);
        payload.append('price', Number(prodForm.price));
        payload.append('stock', Number(prodForm.stock));
        payload.append('category', prodForm.category);
        payload.append('supplier', prodForm.supplier);
        payload.append('description', prodForm.description || 'Premium product catalog listing.');
        payload.append('features', JSON.stringify(prodForm.featuresInput ? prodForm.featuresInput.split(',').map(f => f.trim()).filter(Boolean) : ['Premium Quality', 'Smart Bazaar Special']));
        
        const specifications = [
          { key: 'Supplier', value: prodForm.supplier },
          { key: 'Country of Origin', value: 'Pakistan' }
        ];
        payload.append('specifications', JSON.stringify(specifications));
        payload.append('variants', JSON.stringify(prodForm.variants));
        payload.append('images', prodForm.imageFile);

        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        const images = prodForm.imageUrl
          ? [{ url: prodForm.imageUrl, public_id: `custom-${Date.now()}` }]
          : [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', public_id: 'default' }];

        payload = {
          name: prodForm.name,
          brand: prodForm.brand,
          price: Number(prodForm.price),
          stock: Number(prodForm.stock),
          category: prodForm.category,
          supplier: prodForm.supplier,
          description: prodForm.description || 'Premium product catalog listing.',
          images,
          features: prodForm.featuresInput ? prodForm.featuresInput.split(',').map(f => f.trim()).filter(Boolean) : ['Premium Quality', 'Smart Bazaar Special'],
          specifications: [
            { key: 'Supplier', value: prodForm.supplier },
            { key: 'Country of Origin', value: 'Pakistan' }
          ],
          variants: prodForm.variants
        };
      }

      if (editingProduct) {
        const response = await api.put(`/products/${editingProduct._id}`, payload, { headers });
        if (response.data.success) {
          toast.success('Product updated successfully!');
          const updated = products.map(p => p._id === editingProduct._id ? response.data.product : p);
          setProducts(updated);
          updateStockStatsLocal(updated);
        }
      } else {
        const response = await api.post('/products', payload, { headers });
        if (response.data.success) {
          toast.success('Product registered successfully!');
          const updated = [response.data.product, ...products];
          setProducts(updated);
          updateStockStatsLocal(updated);
        }
      }
      setProductModalOpen(false);
    } catch (err) {
      const chosenCat = categories.find(c => c._id === prodForm.category) || { _id: prodForm.category, name: 'General Catalog' };
      const fallbackProd = {
        _id: editingProduct?._id || `prod-${Date.now()}`,
        name: prodForm.name,
        brand: prodForm.brand,
        price: Number(prodForm.price),
        stock: Number(prodForm.stock),
        category: chosenCat,
        supplier: prodForm.supplier,
        images: [{ url: prodForm.imageUrl || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' }]
      };

      let updated;
      if (editingProduct) {
        updated = products.map(p => p._id === editingProduct._id ? fallbackProd : p);
      } else {
        updated = [fallbackProd, ...products];
      }
      setProducts(updated);
      updateStockStatsLocal(updated);
      toast.info('Local product cache updated.');
      setProductModalOpen(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to soft-delete this catalog product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product soft-deleted successfully.');
      const updated = products.filter(p => p._id !== id);
      setProducts(updated);
      updateStockStatsLocal(updated);
    } catch (err) {
      const updated = products.filter(p => p._id !== id);
      setProducts(updated);
      updateStockStatsLocal(updated);
      toast.info('Removed from local mock database.');
    }
  };

  // ----------------------------------------------------
  // ORDER MANAGEMENT HANDLERS
  // ----------------------------------------------------
  const handleShipOrder = async (id) => {
    try {
      await api.put(`/orders/${id}/status`, { status: 'shipped' });
      toast.success('Order status marked as Shipped!');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'shipped' } : o));
    } catch (err) {
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'shipped' } : o));
      toast.info('Order updated to Shipped locally.');
    }
  };

  const handleDeliverOrder = async (id) => {
    try {
      await api.put(`/orders/${id}/status`, { status: 'delivered' });
      toast.success('Order status marked as Delivered!');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'delivered' } : o));
    } catch (err) {
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'delivered' } : o));
      toast.info('Order updated to Delivered locally.');
    }
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${id}/status`, { status: 'cancelled' });
      toast.success('Order cancelled.');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
      toast.info('Order status updated locally.');
    }
  };

  // ----------------------------------------------------
  // USER PROMOTION HANDLERS
  // ----------------------------------------------------
  const handleRoleToggle = async (id, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/users/${id}`, { role: nextRole });
      toast.success(`User role updated to ${nextRole.toUpperCase()}!`);
      setUsersList(usersList.map(u => u._id === id ? { ...u, role: nextRole } : u));
    } catch (err) {
      setUsersList(usersList.map(u => u._id === id ? { ...u, role: nextRole } : u));
      toast.info(`User updated to ${nextRole.toUpperCase()} locally.`);
    }
  };

  // ----------------------------------------------------
  // SETTINGS PANEL HANDLERS
  // ----------------------------------------------------
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('smart_inventory_name', storeSettings.storeName);
    localStorage.setItem('smart_inventory_currency', storeSettings.currencySymbol);
    localStorage.setItem('smart_inventory_low_stock_threshold', storeSettings.lowStockThreshold);
    localStorage.setItem('smart_inventory_email', storeSettings.storeEmail);
    localStorage.setItem('smart_inventory_shipping', storeSettings.shippingFee);
    
    toast.success('System Settings updated successfully!');
    // Trigger logo re-rendering globally
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('local-storage-update'));
  };

  // ----------------------------------------------------
  // FILTERING COMPUTATIONS
  // ----------------------------------------------------
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(empSearch.toLowerCase()) || 
                          emp.employeeId.toLowerCase().includes(empSearch.toLowerCase());
    const matchesRole = empRoleFilter === 'All' || emp.role === empRoleFilter;
    const matchesAttendance = empAttendanceFilter === 'All' || emp.attendanceStatus === empAttendanceFilter;
    return matchesSearch && matchesRole && matchesAttendance;
  });

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
                          prod.brand.toLowerCase().includes(stockSearch.toLowerCase()) ||
                          (prod.supplier && prod.supplier.toLowerCase().includes(stockSearch.toLowerCase()));
    
    const limitThresh = storeSettings.lowStockThreshold;
    let matchesStatus = true;
    if (stockStatusFilter === 'in-stock') {
      matchesStatus = prod.stock > limitThresh;
    } else if (stockStatusFilter === 'out-of-stock') {
      matchesStatus = prod.stock === 0;
    } else if (stockStatusFilter === 'low-stock') {
      matchesStatus = prod.stock > 0 && prod.stock <= limitThresh;
    }

    const catId = prod.category?._id || prod.category;
    const matchesCategory = stockCategoryFilter === 'All' || catId === stockCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          (order.user?.name && order.user.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
                          (order.user?.email && order.user.email.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = usersList.filter(u => {
    return u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
           u.email.toLowerCase().includes(userSearch.toLowerCase());
  });

  // Visual Chart Data configurations
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: `Monthly Revenue (${storeSettings.currencySymbol})`,
        data: [4200, 5100, 6800, 7200, 8900, stats.totalRevenue ? Math.round(stats.totalRevenue) : 9450],
        backgroundColor: '#6366f1',
        borderColor: '#8B5CF6',
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: '#8B5CF6'
      }
    ]
  };

  const pieChartData = {
    labels: ['Delivered', 'Processing', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [75, 45, 24, 10],
        backgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#EF4444'],
        borderWidth: 2,
        borderColor: '#0F172A',
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94A3B8',
          font: { family: 'Outfit', weight: 'bold' }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(30, 41, 59, 0.3)' },
        ticks: { color: '#94A3B8' }
      },
      y: {
        grid: { color: 'rgba(30, 41, 59, 0.3)' },
        ticks: { color: '#94A3B8' }
      }
    }
  };

  const sidebarItems = [
    { id: 'overview', name: 'Overview Console', icon: Activity, path: '/admin' },
    { id: 'employees', name: 'Employee Records', icon: Users, path: '/admin/employees' },
    { id: 'stock', name: 'Stock & Inventory', icon: Boxes, path: '/admin/products' },
    { id: 'orders', name: 'Orders Console', icon: FileText, path: '/admin/orders' },
    { id: 'users', name: 'Users Registry', icon: Shield, path: '/admin/users' },
    { id: 'settings', name: 'System Settings', icon: Settings, path: '/admin/settings' }
  ];

  if (loading) {
    return (
      <div className="bg-[#030712] min-h-screen flex items-center justify-center text-[#94A3B8] font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Executive MERN Analytics Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#030712] text-[#F8FAFC] min-h-screen relative overflow-hidden select-none flex flex-col lg:flex-row">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#6366F1]/5 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#EC4899]/5 rounded-full filter blur-[120px] pointer-events-none z-0"></div>

      {/* LEFT SIDEBAR (Desktop) */}
      <div className="hidden lg:flex flex-col w-64 border-r border-slate-900/60 bg-[#080d1e]/40 backdrop-blur-xl p-6 gap-6 relative shrink-0 z-20">
        <div className="space-y-1.5 pb-4 border-b border-slate-900/60">
          <div className="flex items-center gap-2 text-indigo-500 font-extrabold text-lg">
            <Sparkles className="w-5 h-5" />
            <span>Smart Bazaar</span>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Console Terminal</p>
        </div>

        <nav className="flex-grow flex flex-col gap-2">
          {sidebarItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { navigate(item.path); }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all text-left ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-[#94A3B8] hover:bg-slate-900/40 hover:text-white'
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-900/60 flex items-center gap-2.5 text-xs text-slate-500 font-bold">
          <Activity className="w-4 h-4 text-green-400" />
          <span>Console v2.0 - Live</span>
        </div>
      </div>

      {/* MOBILE HEADER BAR & DROPDOWN */}
      <div className="lg:hidden flex flex-col bg-[#080d1e]/80 border-b border-slate-900/60 p-4 sticky top-20 z-40 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-500 font-extrabold text-sm uppercase tracking-widest">
            <Sparkles className="w-4.5 h-4.5" />
            <span>{storeSettings.storeName}</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-slate-850">
            {sidebarItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT MAIN PANEL */}
      <div className="flex-grow p-6 lg:p-10 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full text-left relative z-10">
        
        {/* Header Title Console Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900/60 pb-6 gap-4">
          <div className="space-y-1">
            <h1 className="font-display font-extrabold text-3.5xl text-white">
              {activeTab === 'overview' && 'System Analytics Overview'}
              {activeTab === 'employees' && 'Employee Records'}
              {activeTab === 'stock' && 'Stock & Inventory Management'}
              {activeTab === 'orders' && 'Orders Console'}
              {activeTab === 'users' && 'Users Registry'}
              {activeTab === 'settings' && 'Console System Settings'}
            </h1>
            <p className="text-[#94A3B8] text-sm font-light">
              {activeTab === 'overview' && 'Oversee store KPIs, operational distributions, recent sales and inventory alerts.'}
              {activeTab === 'employees' && 'Manage shop administrators, cashier shift accounts, sales reps and attendance logs.'}
              {activeTab === 'stock' && 'Track product stock deficits, supplier contact links, and edit catalog products.'}
              {activeTab === 'orders' && 'Monitor billing transactions, ship packaging logs and change order statuses.'}
              {activeTab === 'users' && 'Promote customer accounts to system administrator credentials.'}
              {activeTab === 'settings' && 'Configure custom store parameters, currencies, low stock counts threshold and contact.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 bg-slate-900/50 border border-slate-800/80 px-4 py-2.5 rounded-2xl backdrop-blur-md">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold text-[#F8FAFC]">Live Database Connected</span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB CONTENT: OVERVIEW */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI grid cards list - ROW 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `${storeSettings.currencySymbol}${stats.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20', onClick: () => {} },
                { label: 'Total Orders', value: stats.totalOrders, icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', onClick: () => navigate('/admin/orders') },
                { label: 'Catalog Products', value: stats.totalProducts, icon: ShoppingBag, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', onClick: () => navigate('/admin/products') },
                { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/20', onClick: () => navigate('/admin/users') }
              ].map((kpi, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -4 }}
                  onClick={kpi.onClick}
                  className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[1.5rem] p-6 shadow-xl backdrop-blur-md flex items-center gap-5 relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[1.5rem]"></div>
                  <div className={`p-4 rounded-2xl border flex-shrink-0 ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] font-black uppercase tracking-widest block">{kpi.label}</span>
                    <span className="text-2xl font-black text-white mt-1 block">{kpi.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* KPI Grid - ROW 2 (Employees, In Stock, Out of Stock, Low Stock Alerts) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Employees Records', 
                  value: `${stats.totalEmployees || 0} Total`, 
                  subValue: `${stats.presentEmployees || 0} Present Today`, 
                  icon: Users, 
                  color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', 
                  onClick: () => navigate('/admin/employees') 
                },
                { 
                  label: 'In Stock Items', 
                  value: `${stats.inStockCount || 0} Products`, 
                  subValue: 'Available in Catalog', 
                  icon: Boxes, 
                  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', 
                  onClick: () => { navigate('/admin/products'); setStockStatusFilter('in-stock'); } 
                },
                { 
                  label: 'Out of Stock', 
                  value: `${stats.outOfStockCount || 0} Products`, 
                  subValue: 'Unavailable / Sold Out', 
                  icon: AlertTriangle, 
                  color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', 
                  onClick: () => { navigate('/admin/products'); setStockStatusFilter('out-of-stock'); } 
                },
                { 
                  label: 'Low Stock Alerts', 
                  value: `${stats.lowStockCount || 0} Needs Restock`, 
                  subValue: `Under ${storeSettings.lowStockThreshold} Units Left`, 
                  icon: AlertTriangle, 
                  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', 
                  onClick: () => { navigate('/admin/products'); setStockStatusFilter('low-stock'); } 
                }
              ].map((kpi, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -4 }}
                  onClick={kpi.onClick}
                  className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[1.5rem] p-6 shadow-xl backdrop-blur-md flex items-center gap-5 relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[1.5rem]"></div>
                  <div className={`p-4 rounded-2xl border flex-shrink-0 ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] font-black uppercase tracking-widest block">{kpi.label}</span>
                    <span className="text-xl font-black text-white mt-1 block">{kpi.value}</span>
                    <span className="text-[#94A3B8]/60 text-[9px] font-medium mt-0.5 block">{kpi.subValue}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Graphic Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Monthly Revenue Bar Chart */}
              <div className="lg:col-span-2 bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-lg text-white">Revenue Progression</h3>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-[#94A3B8] font-bold px-2.5 py-1 rounded-md">USD MONTHLY</span>
                </div>
                <div className="h-64 flex items-center justify-center">
                  <Bar data={barChartData} options={chartOptions} />
                </div>
              </div>

              {/* Order Status Pie Chart */}
              <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md space-y-6">
                <h3 className="font-display font-extrabold text-lg text-white">Order Distributions</h3>
                <div className="h-64 flex items-center justify-center">
                  <Pie data={pieChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: '#94A3B8',
                          font: { family: 'Outfit', weight: 'bold' }
                        }
                      }
                    }
                  }} />
                </div>
              </div>
            </div>

            {/* Operational lists: Recent Orders and Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders table */}
              <div className="lg:col-span-2 bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-lg text-white">Recent Orders</h3>
                  <button 
                    onClick={() => navigate('/admin/orders')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1"
                  >
                    View All Orders
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[#94A3B8] font-semibold uppercase text-xs">
                        <th className="py-4 px-4">Order ID</th>
                        <th className="py-4 px-4">Customer</th>
                        <th className="py-4 px-4">Total Price</th>
                        <th className="py-4 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders?.slice(0, 5).map(order => (
                        <tr key={order._id} className="border-b border-slate-900/50 hover:bg-slate-900/40 transition-colors">
                          <td className="py-4.5 px-4 font-bold text-white/95">{order._id}</td>
                          <td className="py-4.5 px-4 text-[#94A3B8] font-medium">{order.user?.name}</td>
                          <td className="py-4.5 px-4 text-[#EC4899] font-black">{storeSettings.currencySymbol}{order.totalPrice?.toFixed(2)}</td>
                          <td className="py-4.5 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                              order.status === 'processing' ? 'bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/25' :
                              order.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 
                              'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md space-y-6">
                <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Stock Deficits
                </h3>

                <div className="space-y-4">
                  {stats.lowStockAlerts?.length === 0 ? (
                    <p className="text-[#94A3B8] text-sm font-light">Inventory levels are currently normal across all catalog listings.</p>
                  ) : (
                    stats.lowStockAlerts?.map(item => (
                      <div key={item._id} className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-900 rounded-2xl">
                        <div className="min-w-0 text-left">
                          <h5 className="font-bold text-white text-sm truncate">{item.name}</h5>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5 block">{item.brand}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md">
                            {item.stock} Left
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB CONTENT: EMPLOYEES */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#0F172A]/30 border border-slate-900/60 p-5 rounded-3xl backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row flex-grow gap-3 max-w-3xl">
                {/* Search */}
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by Employee Name or ID..."
                    value={empSearch}
                    onChange={(e) => setEmpSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-white font-medium"
                  />
                </div>

                {/* Role Filter */}
                <div className="relative min-w-44">
                  <select
                    value={empRoleFilter}
                    onChange={(e) => setEmpRoleFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl focus:outline-none text-sm text-white font-medium appearance-none"
                  >
                    <option value="All">All Roles</option>
                    <option value="Manager">Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Salesperson">Salesperson</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                {/* Attendance Filter */}
                <div className="relative min-w-44">
                  <select
                    value={empAttendanceFilter}
                    onChange={(e) => setEmpAttendanceFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl focus:outline-none text-sm text-white font-medium appearance-none"
                  >
                    <option value="All">All Attendance</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={handleOpenAddEmployee}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all shrink-0"
              >
                <UserPlus className="w-4.5 h-4.5" />
                Add Employee
              </button>
            </div>

            {/* Table Container */}
            <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
                      <th className="py-5 px-6">Employee ID</th>
                      <th className="py-5 px-6">Name</th>
                      <th className="py-5 px-6">Role</th>
                      <th className="py-5 px-6">Phone Number</th>
                      <th className="py-5 px-6">Attendance Status</th>
                      <th className="py-5 px-6">Salary (Monthly)</th>
                      <th className="py-5 px-6">Joining Date</th>
                      <th className="py-5 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-slate-500">
                          No matching employee records found.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map(emp => (
                        <tr key={emp._id} className="border-b border-slate-900/50 hover:bg-slate-900/20 transition-colors">
                          <td className="py-4.5 px-6 font-mono font-bold text-white">{emp.employeeId}</td>
                          <td className="py-4.5 px-6 font-bold text-white">{emp.name}</td>
                          <td className="py-4.5 px-6">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              emp.role === 'Manager' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25' :
                              emp.role === 'Cashier' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/25' :
                              'bg-purple-500/15 text-purple-400 border border-purple-500/25'
                            }`}>
                              <Briefcase className="w-3 h-3" />
                              {emp.role}
                            </span>
                          </td>
                          <td className="py-4.5 px-6 text-slate-400 font-medium">{emp.phoneNumber}</td>
                          <td className="py-4.5 px-6">
                            <button
                              onClick={() => handleToggleAttendance(emp)}
                              title="Click to cycle status"
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border transition-all ${
                                emp.attendanceStatus === 'Present' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25' :
                                emp.attendanceStatus === 'Leave' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/25' :
                                'bg-rose-500/15 text-rose-400 border-rose-500/25 hover:bg-rose-50/15'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                emp.attendanceStatus === 'Present' ? 'bg-emerald-500' :
                                emp.attendanceStatus === 'Leave' ? 'bg-amber-500' :
                                'bg-rose-500'
                              }`}></span>
                              {emp.attendanceStatus}
                            </button>
                          </td>
                          <td className="py-4.5 px-6 text-[#EC4899] font-black">{storeSettings.currencySymbol}{emp.salary?.toLocaleString()}</td>
                          <td className="py-4.5 px-6 text-slate-400 font-medium">
                            {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                          </td>
                          <td className="py-4.5 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleOpenEditEmployee(emp)}
                                className="p-2 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/10 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEmployee(emp._id)}
                                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB CONTENT: STOCK/INVENTORY */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#0F172A]/30 border border-slate-900/60 p-5 rounded-3xl backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row flex-grow gap-3 max-w-3xl">
                {/* Search */}
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by Product Name, Brand, or Supplier..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-white font-medium"
                  />
                </div>

                {/* Stock Level Filter */}
                <div className="relative min-w-44">
                  <select
                    value={stockStatusFilter}
                    onChange={(e) => setStockStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl focus:outline-none text-sm text-white font-medium appearance-none"
                  >
                    <option value="All">All Stock Levels</option>
                    <option value="in-stock">In Stock (&gt; {storeSettings.lowStockThreshold})</option>
                    <option value="low-stock">Low Stock (1 - {storeSettings.lowStockThreshold})</option>
                    <option value="out-of-stock">Out of Stock (0)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                {/* Category Filter */}
                <div className="relative min-w-44">
                  <select
                    value={stockCategoryFilter}
                    onChange={(e) => setStockCategoryFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl focus:outline-none text-sm text-white font-medium appearance-none"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={handleOpenAddProduct}
                className="bg-[#6366F1] hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all shrink-0"
              >
                <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
                Add Product
              </button>
            </div>

            {/* Table Container */}
            <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
                      <th className="py-5 px-6">Product Details</th>
                      <th className="py-5 px-6">Category</th>
                      <th className="py-5 px-6">Supplier</th>
                      <th className="py-5 px-6">Price</th>
                      <th className="py-5 px-6">Stock Status</th>
                      <th className="py-5 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-500">
                          No matching catalog items found in database.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(prod => {
                        const limitThresh = storeSettings.lowStockThreshold;
                        const isLow = prod.stock > 0 && prod.stock <= limitThresh;
                        const isOut = prod.stock === 0;
                        
                        return (
                          <tr key={prod._id} className="border-b border-slate-900/50 hover:bg-slate-900/20 transition-colors">
                            <td className="py-4.5 px-6">
                              <span className="font-bold text-white block">{prod.name}</span>
                              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5 block">{prod.brand}</span>
                            </td>
                            <td className="py-4.5 px-6 text-slate-400 font-medium">
                              {prod.category?.name || prod.category || 'General'}
                            </td>
                            <td className="py-4.5 px-6 text-slate-400 font-medium">
                              {prod.supplier || 'Sahu Distribution Corp'}
                            </td>
                            <td className="py-4.5 px-6 text-[#6366F1] font-black">{storeSettings.currencySymbol}{prod.price?.toFixed(2)}</td>
                            <td className="py-4.5 px-6">
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
                                {prod.stock} Units {isOut ? 'Out' : isLow ? 'Low' : 'OK'}
                              </span>
                            </td>
                            <td className="py-4.5 px-6">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-2 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/10 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(prod._id)}
                                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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
        {/* TAB CONTENT: ORDERS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#0F172A]/30 border border-slate-900/60 p-5 rounded-3xl backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row flex-grow gap-3 max-w-2xl">
                {/* Search */}
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer Name, or Email..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-white font-medium"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative min-w-48">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl focus:outline-none text-sm text-white font-medium appearance-none"
                  >
                    <option value="All">All Order Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
                      <th className="py-5 px-6">Order ID</th>
                      <th className="py-5 px-6">Customer Details</th>
                      <th className="py-5 px-6">Paid</th>
                      <th className="py-5 px-6">Total Price</th>
                      <th className="py-5 px-6">Status</th>
                      <th className="py-5 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-500">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order._id} className="border-b border-slate-900/50 hover:bg-slate-900/20 transition-colors">
                          <td className="py-4.5 px-6 font-mono font-bold text-white">{order._id}</td>
                          <td className="py-4.5 px-6">
                            <span className="font-bold text-white block">{order.user?.name || 'Guest User'}</span>
                            <span className="text-xs text-slate-400 block">{order.user?.email || 'N/A'}</span>
                          </td>
                          <td className="py-4.5 px-6">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                              order.isPaid 
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            }`}>
                              {order.isPaid ? 'YES' : 'NO'}
                            </span>
                          </td>
                          <td className="py-4.5 px-6 text-[#EC4899] font-black">{storeSettings.currencySymbol}{order.totalPrice?.toFixed(2)}</td>
                          <td className="py-4.5 px-6">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider capitalize ${
                              order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                              order.status === 'processing' ? 'bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/25' :
                              order.status === 'shipped' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/25' :
                              order.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 
                              'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4.5 px-6">
                            <div className="flex items-center justify-center gap-2">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleShipOrder(order._id)}
                                  className="px-3 py-1.5 bg-[#6366F1]/10 hover:bg-[#6366F1] text-[#6366F1] hover:text-white border border-[#6366F1]/30 rounded-xl text-xs font-bold transition-all"
                                >
                                  Process / Ship
                                </button>
                              )}
                              {order.status === 'processing' && (
                                <button
                                  onClick={() => handleShipOrder(order._id)}
                                  className="px-3 py-1.5 bg-[#6366F1]/10 hover:bg-[#6366F1] text-[#6366F1] hover:text-white border border-[#6366F1]/30 rounded-xl text-xs font-bold transition-all"
                                >
                                  Mark Shipped
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => handleDeliverOrder(order._id)}
                                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
                                >
                                  Deliver Order
                                </button>
                              )}
                              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                                  title="Cancel Order"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB CONTENT: USERS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#0F172A]/30 border border-slate-900/60 p-5 rounded-3xl backdrop-blur-sm">
              <div className="flex-grow max-w-xl">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by User Name or Email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[#94A3B8] font-bold uppercase text-xs tracking-wider">
                      <th className="py-5 px-6">Name</th>
                      <th className="py-5 px-6">Email Address</th>
                      <th className="py-5 px-6">Privilege Status</th>
                      <th className="py-5 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-slate-500">
                          No registered users match search query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u._id} className="border-b border-slate-900/50 hover:bg-slate-900/20 transition-colors">
                          <td className="py-4.5 px-6 font-bold text-white">{u.name}</td>
                          <td className="py-4.5 px-6 text-slate-400 font-medium">{u.email}</td>
                          <td className="py-4.5 px-6">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              u.role === 'admin' 
                                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25' 
                                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                            }`}>
                              {u.role === 'admin' ? 'ADMIN' : 'CUSTOMER'}
                            </span>
                          </td>
                          <td className="py-4.5 px-6">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleRoleToggle(u._id, u.role)}
                                className="px-3.5 py-1.5 bg-slate-950/40 hover:bg-indigo-600 border border-slate-850 hover:border-indigo-600 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                              >
                                <Shield className="w-3.5 h-3.5" />
                                {u.role === 'admin' ? 'Demote to User' : 'Promote Admin'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB CONTENT: SETTINGS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="bg-[#0F172A]/40 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl backdrop-blur-md space-y-6 max-w-3xl">
            <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              Store Configuration Parameters
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Store Branding Name *</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Currency Symbol (e.g. $, PKR, €)</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.currencySymbol}
                    onChange={(e) => setStoreSettings({ ...storeSettings, currencySymbol: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold text-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Low Stock Warning Limit</label>
                  <input
                    type="number"
                    required
                    value={storeSettings.lowStockThreshold}
                    onChange={(e) => setStoreSettings({ ...storeSettings, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Base Shipping Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={storeSettings.shippingFee}
                    onChange={(e) => setStoreSettings({ ...storeSettings, shippingFee: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Support Contact Email</label>
                  <input
                    type="email"
                    required
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold text-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-850 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all"
                >
                  <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                  Save Console Settings
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD/EDIT EMPLOYEE */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {employeeModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-8 space-y-6 relative text-left"
            >
              <button 
                onClick={() => setEmployeeModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <h3 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
                  {editingEmployee ? <Edit3 className="w-6 h-6 text-indigo-500" /> : <UserPlus className="w-6 h-6 text-indigo-500" />}
                  {editingEmployee ? 'Edit Employee Details' : 'Register New Employee'}
                </h3>
                <p className="text-slate-400 text-xs font-light">Fill out employee information parameters to track records.</p>
              </div>

              <form onSubmit={handleSaveEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Employee ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EMP101"
                      value={empForm.employeeId}
                      onChange={(e) => setEmpForm({ ...empForm, employeeId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Role *</label>
                    <select
                      value={empForm.role}
                      onChange={(e) => setEmpForm({ ...empForm, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none text-sm font-semibold text-white transition-all"
                    >
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Salesperson">Salesperson</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Employee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahu Ahmed"
                    value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +92 300 1234567"
                      value={empForm.phoneNumber}
                      onChange={(e) => setEmpForm({ ...empForm, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance Status</label>
                    <select
                      value={empForm.attendanceStatus}
                      onChange={(e) => setEmpForm({ ...empForm, attendanceStatus: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none text-sm font-semibold text-white transition-all"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly Salary ({storeSettings.currencySymbol}) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45000"
                      value={empForm.salary}
                      onChange={(e) => setEmpForm({ ...empForm, salary: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Joining Date</label>
                    <input
                      type="date"
                      value={empForm.joiningDate}
                      onChange={(e) => setEmpForm({ ...empForm, joiningDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setEmployeeModalOpen(false)}
                    className="w-1/3 py-3 bg-slate-950/30 hover:bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all"
                  >
                    {editingEmployee ? 'Save Changes' : 'Register Employee'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD/EDIT PRODUCT */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {productModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 space-y-6 relative text-left"
            >
              <button 
                onClick={() => setProductModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <h3 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
                  {editingProduct ? <Edit3 className="w-6 h-6 text-indigo-500" /> : <Plus className="w-6 h-6 text-indigo-500" />}
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product Listing'}
                </h3>
                <p className="text-slate-400 text-xs font-light">Fill out details below to create or update catalog stock listings.</p>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sahu Premium Polo Shirt"
                      value={prodForm.name}
                      onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SahuShirts"
                      value={prodForm.brand}
                      onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price ({storeSettings.currencySymbol}) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="49.99"
                      value={prodForm.price}
                      onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stock quantity *</label>
                    <input
                      type="number"
                      required
                      placeholder="100"
                      value={prodForm.stock}
                      onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category *</label>
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none text-sm font-semibold text-white transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Supplier Details</label>
                    <input
                      type="text"
                      placeholder="e.g. Sahu Distribution Corp"
                      value={prodForm.supplier}
                      onChange={(e) => setProdForm({ ...prodForm, supplier: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Features (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Premium Blend, Wrinkle-free"
                      value={prodForm.featuresInput}
                      onChange={(e) => setProdForm({ ...prodForm, featuresInput: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Description</label>
                  <textarea
                    rows="3"
                    placeholder="Provide a detailed description..."
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upload Product Image (from PC)</label>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={!!prodForm.imageUrl}
                      onChange={(e) => setProdForm({ ...prodForm, imageFile: e.target.files?.[0] || null })}
                      className="w-full px-4 py-1.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none text-xs text-white file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 transition-all disabled:opacity-40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or Image Link URL (from Web)</label>
                    <input
                      type="text"
                      disabled={!!prodForm.imageFile}
                      placeholder="https://images.unsplash.com/..."
                      value={prodForm.imageUrl}
                      onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-white transition-all disabled:opacity-40"
                    />
                  </div>
                </div>

                {/* Variants Editor Subsection */}
                <div className="border-t border-slate-800/80 pt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-white">
                    <Tag className="w-4 h-4 text-indigo-500" />
                    <h4 className="font-bold text-xs uppercase tracking-wide">Variants Configurations (Optional)</h4>
                  </div>

                  <div className="bg-slate-950/30 border border-slate-800/60 rounded-2xl p-4 space-y-3">
                    <div className="grid grid-cols-4 gap-2 items-end">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Size</label>
                        <select
                          value={vSize}
                          onChange={(e) => setVSize(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                        >
                          {['S', 'M', 'L', 'XL', 'XXL'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Color</label>
                        <select
                          value={vColor}
                          onChange={(e) => setVColor(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                        >
                          {['White', 'Blue', 'Black', 'Red', 'Gray', 'Pink', 'Multi'].map(col => <option key={col} value={col}>{col}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Price (Opt)</label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={vPrice}
                          onChange={(e) => setVPrice(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Stock qty</label>
                        <input
                          type="number"
                          value={vStock}
                          onChange={(e) => setVStock(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddVariantOption}
                      className="w-full py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-lg transition-all"
                    >
                      + Add Option Variant
                    </button>

                    {prodForm.variants.length > 0 && (
                      <div className="border border-slate-800/80 bg-slate-950/20 rounded-xl overflow-hidden mt-2">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-950 border-b border-slate-850 text-slate-500 font-bold">
                              <th className="py-2 px-3">Size</th>
                              <th className="py-2 px-3">Color</th>
                              <th className="py-2 px-3">Price</th>
                              <th className="py-2 px-3">Stock</th>
                              <th className="py-2 px-3 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prodForm.variants.map((v, index) => (
                              <tr key={index} className="border-b border-slate-900/40 hover:bg-slate-900/10 transition-colors">
                                <td className="py-2 px-3 font-bold text-white">{v.size}</td>
                                <td className="py-2 px-3 text-slate-400">{v.color}</td>
                                <td className="py-2 px-3 text-indigo-400 font-bold">{v.price ? `${storeSettings.currencySymbol}${v.price}` : 'Base price'}</td>
                                <td className="py-2 px-3 text-slate-300 font-bold">{v.stock} Units</td>
                                <td className="py-2 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVariantOption(index)}
                                    className="text-rose-500 hover:text-rose-400"
                                  >
                                    Remove
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

                <div className="flex gap-4 pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="w-1/3 py-3 bg-slate-950/30 hover:bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all"
                  >
                    {editingProduct ? 'Save Product' : 'Register Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
