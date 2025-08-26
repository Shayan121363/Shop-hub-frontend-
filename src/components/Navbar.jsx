import React, { useState } from 'react';
import { useCart } from '../services/CartContext';
import {
  ShoppingBag,
  Home,
  Package,
  User,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Settings,
  Shield
} from 'lucide-react';

const Navbar = ({
  onGoHome,
  onGoToProducts,
  onGoToCart,
  onGoToAccount,
  onGoToAdmin,
  onLogout,
  user,
  currentPage
}) => {
  const { getTotalItems, isAuthenticated } = useCart();
  const totalItems = isAuthenticated() ? getTotalItems() : 0;
  const showCartCount = isAuthenticated() && totalItems > 0;

  const [menuOpen, setMenuOpen] = useState(false);

  const handleAccountClick = () => {
    onGoToAccount();
    setMenuOpen(false);
  };

  const handleAdminClick = () => {
    onGoToAdmin();
    setMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
  };

  const handleCartClick = () => {
    if (!isAuthenticated()) {
      alert('Please login to access your cart');
      onGoToAccount();
      return;
    }
    onGoToCart();
    setMenuOpen(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={onGoHome}>
          <ShoppingBag className="logo-icon" />
          <span className="logo-text">ShopHub</span>
        </div>

        {/* Hamburger Menu */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </div>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <button
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => {
              onGoHome();
              setMenuOpen(false);
            }}
          >
            <Home className="nav-icon" />
            <span>Home</span>
          </button>

          <button
            className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => {
              onGoToProducts();
              setMenuOpen(false);
            }}
          >
            <Package className="nav-icon" />
            <span>Products</span>
          </button>

          <button
            className={`nav-link cart-link ${currentPage === 'cart' ? 'active' : ''} ${
              !isAuthenticated() ? 'disabled' : ''
            }`}
            onClick={handleCartClick}
          >
            <div className="cart-icon-container">
              <ShoppingCart className="nav-icon" />
              {showCartCount && <span className="cart-count">{totalItems}</span>}
              {!isAuthenticated() && <span className="cart-lock"></span>}
            </div>
            <span>Cart</span>
          </button>

          {/* Admin Section - Only show for admins */}
          {isAdmin && (
            <button
              className={`nav-link admin-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={handleAdminClick}
            >
              <Shield className="nav-icon" />
              <span>Admin</span>
            </button>
          )}

          {user ? (
            <>
              <button
                className={`nav-link ${currentPage === 'account' ? 'active' : ''}`}
                onClick={handleAccountClick}
              >
                <User className="nav-icon" />
                <div className="user-info">
                  <span className="user-name">{user.name || 'Account'}</span>
                  {/* {isAdmin && <span className="user-role">Admin</span>} */}
                </div>
              </button>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <LogOut className="nav-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              className={`nav-link ${currentPage === 'account' ? 'active' : ''}`}
              onClick={handleAccountClick}
            >
              <User className="nav-icon" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;