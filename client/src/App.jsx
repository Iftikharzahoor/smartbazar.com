import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AIChatWidget from './components/AIChatWidget.jsx';

// Core Pages
import Home from './pages/Home.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CartPage from './pages/CartPage.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import Faq from './pages/Faq.jsx';
import Privacy from './pages/Privacy.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';

import { useAuth } from './hooks/useAuth.js';
import { useCart } from './hooks/useCart.js';

// Protected Route Wrapper for customers
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="py-20 text-center text-[#94A3B8] font-medium bg-[#030712] min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Wrapper for administrators
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="py-20 text-center text-[#94A3B8] font-medium bg-[#030712] min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { checkUserSession, isAuthenticated } = useAuth();
  const { fetchCart, mergeGuestCart } = useCart();

  // Recover active session and fetch user cart on load
  useEffect(() => {
    const initSession = async () => {
      // checkUserSession returns a primitive boolean (true/false) to prevent truthiness bugs
      const recovered = await checkUserSession();
      if (recovered) {
        await fetchCart();
      }
    };
    initSession();
  }, []);

  // Merge guest cart to db cart when user successfully logs in
  useEffect(() => {
    if (isAuthenticated) {
      mergeGuestCart();
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Admin routes panel */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}

export default App;
