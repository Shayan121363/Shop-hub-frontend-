import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import Product from './store/Product';
import ProductDescriptionPage from './store/ProductDescriptionPage';
import CartPage from './services/CartPage';
import Login from './components/Login';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import { CartProvider } from './services/CartContext';
import { 
  setCredentials, 
  logout as logoutAction, 
  selectCurrentUser, 
  selectCurrentToken, 
  selectIsAuthenticated,
  selectIsAdmin 
} from './auth/authSlice';

function AppContent() {
  const dispatch = useDispatch();
  
  // Redux selectors
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  
  // Local state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      // Try to parse the token and restore user session
      try {
        const parsedToken = typeof storedToken === 'string' ? storedToken : JSON.parse(storedToken);
        // You might want to validate the token here by calling an API
        dispatch(setCredentials({ 
          user: { hasToken: true }, 
          token: parsedToken 
        }));
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('token');
      }
    }
  }, [dispatch, token]);

  // Navigation handlers
  const handleLogout = () => {
    dispatch(logoutAction());
    setCurrentPage('home');
    setSelectedProduct(null);
  };

  const handleUserDataUpdate = (userData) => {
    if (userData && token) {
      dispatch(setCredentials({ user: userData, token }));
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentPage('description');
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setCurrentPage('products');
  };

  const handleGoHome = () => {
    setCurrentPage('home');
    setSelectedProduct(null);
  };

  const handleGoToProducts = () => {
    setCurrentPage('products');
  };

  const handleGoToCart = () => {
    if (!isAuthenticated) {
      alert('Please login to view your cart');
      setCurrentPage('account');
      return;
    }
    setCurrentPage('cart');
  };

  const handleGoToAccount = () => {
    setCurrentPage('account');
  };

  const handleGoToAdmin = () => {
    if (!isAdmin) {
      alert('Admin access required');
      return;
    }
    setCurrentPage('admin');
  };

  const handleDemoLogin = () => {
    const demoToken = 'demo-token-' + Date.now();
    const demoUser = { 
      name: 'Demo User', 
      email: 'demo@example.com', 
      role: 'user',
      _id: 'demo-id-' + Date.now() 
    };
    
    localStorage.setItem('token', JSON.stringify(demoToken));
    dispatch(setCredentials({ user: demoUser, token: demoToken }));
    setCurrentPage('home');
  };

  const handleDemoAdminLogin = () => {
    const demoToken = 'demo-admin-token-' + Date.now();
    const demoAdmin = { 
      name: 'Admin Demo', 
      email: 'admin@example.com', 
      role: 'admin',
      _id: 'admin-demo-id-' + Date.now() 
    };
    
    localStorage.setItem('token', JSON.stringify(demoToken));
    dispatch(setCredentials({ user: demoAdmin, token: demoToken }));
    setCurrentPage('admin');
  };

  return (
    <div className="App">
      <Navbar 
        onGoHome={handleGoHome}
        onGoToProducts={handleGoToProducts}
        onGoToCart={handleGoToCart}
        onGoToAccount={handleGoToAccount}
        onGoToAdmin={handleGoToAdmin}
        onLogout={handleLogout}
        user={user}
        currentPage={currentPage}
      />        
      
      <main className="main-content">
        {/* Home Page */}
        {currentPage === 'home' && (
          <HeroSection onShopNow={handleGoToProducts} />
        )}

        {/* Products Page */}
        {currentPage === 'products' && (
          <Product 
            onProductSelect={handleProductSelect}
            onLoginRedirect={handleGoToAccount} 
          />
        )}

        {/* Product Description Page */}
        {currentPage === 'description' && (
          <ProductDescriptionPage 
            product={selectedProduct}
            onBackToProducts={handleBackToProducts}
          />
        )}

        {/* Cart Page */}
        {currentPage === 'cart' && isAuthenticated && (
          <CartPage onBackToProducts={handleGoToProducts} />
        )}

        {currentPage === 'cart' && !isAuthenticated && (
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please login to view your cart</p>
            <button onClick={handleGoToAccount} className="login-btn">
              Go to Login
            </button>
          </div>
        )}

        {/* Admin Dashboard */}
        {currentPage === 'admin' && (
          <AdminDashboard user={user} token={token} />
        )}

        {/* Account/Login Page */}
        {currentPage === 'account' && (
          <div className="account-page">
            <div className="auth-container">
              {!isAuthenticated ? (
                <div className="login-section">
                  <h2>Welcome Back</h2>
                  <p>Please login to access your account and cart</p>
                  <Login onUserDataUpdate={handleUserDataUpdate} />
                  
                  {/* <div className="demo-section">
                    <p>or try demo account:</p>
                    <div className="demo-buttons">
                      <button className="demo-login-btn" onClick={handleDemoLogin}>
                        Demo User Login
                      </button>
                      <button className="demo-admin-btn" onClick={handleDemoAdminLogin}>
                        Demo Admin Login
                      </button>
                    </div>
                  </div> */}
                </div>
              ) : (
                <div className="profile-section">
                  <div className="profile-header">
                    <h2>Your Account</h2>
                    {isAdmin && (
                      <div className="admin-badge">
                        <span>Admin Account</span>
                        <button 
                          onClick={handleGoToAdmin}
                          className="admin-dashboard-btn"
                        >
                          Go to Admin Dashboard
                        </button>
                      </div>
                    )}
                  </div>
                  <Profile 
                    onUserDataUpdate={handleUserDataUpdate} 
                    onLogout={handleLogout}
                    userData={user}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  const [msg, setMsg] = useState();

  useEffect(() => {
    fetch("http://localhost:4000/")
      .then(res => res.text())
      .then(data => setMsg(data.message))
      .catch(err => console.log(err));
  }, []);

  return (  
    <CartProvider>
      <div>
        {msg && (
          <div className="backend-status">
            <p> Backend Connected: {msg}</p>
          </div>
        )}
        <AppContent />
      </div>

      <style >{`
        .backend-status {
          background: #10b981;
          color: white;
          text-align: center;
          padding: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
    </CartProvider>
  );
}

export default App;