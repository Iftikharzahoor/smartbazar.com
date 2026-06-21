import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';
import { ShoppingBag, Heart, User, LogOut, LayoutDashboard, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutUser } = useAuth();
  const { cartItems } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeName, setStoreName] = useState(localStorage.getItem('smart_inventory_name') || 'Smart Inventory');

  useEffect(() => {
    const handleStorageChange = () => {
      setStoreName(localStorage.getItem('smart_inventory_name') || 'Smart Inventory');
    };
    window.addEventListener('storage', handleStorageChange);
    // Listen to local custom event since standard storage event only fires in other tabs
    window.addEventListener('local-storage-update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleStorageChange);
    };
  }, []);

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-slate-100 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-display font-extrabold text-2xl tracking-tight text-indigo-600 flex items-center gap-2">
              {storeName.split(' ')[0]}<span className="text-slate-900">{storeName.split(' ').slice(1).join(' ') || 'Inventory'}</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
            <Link to="/products" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Catalog</Link>
            <Link to="/about" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">About Us</Link>
            <Link to="/employee/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Employee Portal</Link>
          </div>

          {/* Action Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative text-slate-600 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-50 transition-all">
              <Heart className="w-6 h-6" />
              {user?.wishlist?.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative text-slate-600 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-50 transition-all">
              <ShoppingCart className="w-6 h-6" />
              {totalCartQty > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1.5 flex items-center justify-center bg-indigo-600 text-white font-semibold text-xs rounded-full ring-2 ring-white">
                  {totalCartQty}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-semibold text-sm text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Order History
                    </Link>

                    <hr className="border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-5 text-sm rounded-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-t border-slate-100 py-4 px-6 space-y-4 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium hover:text-indigo-600"
          >
            Catalog
          </Link>
          <Link
            to="/employee/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium hover:text-indigo-600"
          >
            Employee Portal
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-slate-700 font-medium hover:text-indigo-600"
          >
            <span>Cart</span>
            {totalCartQty > 0 && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">{totalCartQty}</span>
            )}
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium hover:text-indigo-600"
          >
            Wishlist
          </Link>

          <hr className="border-slate-100" />

          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-indigo-600"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-indigo-600"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-sm text-rose-600 font-medium text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full py-2.5 text-center text-sm font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
