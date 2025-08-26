import React, { useState } from 'react';
import { useCart } from '../services/CartContext';
import { useAuth } from '../pages/AuthContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity, isInCart, loading, error } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  const quantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setMessage('');

    const result = await addToCart(product, 1);
    
    if (result.success) {
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
    
    setIsAdding(false);
  };

  const handleQuantityChange = async (newQuantity) => {
    const result = await updateQuantity(product.id, newQuantity);
    if (!result.success) {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        
     
        {message && (
          <div className={`message ${message.includes('Added') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

    
        <div className="cart-actions">
          {!isAuthenticated ? (
            <div className="auth-required">
              <p>Login required to add items</p>
            </div>
          ) : !inCart ? (
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={isAdding || loading}
            >
              <ShoppingCart className="btn-icon" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          ) : (
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={loading}
              >
                <Minus className="btn-icon" />
              </button>
              
              <span className="quantity-display">{quantity}</span>
              
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={loading}
              >
                <Plus className="btn-icon" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const ProductList = ({ products }) => {
  const { getCartSummary, clearError } = useCart();
  const { error: authError } = useAuth();
  
  const cartSummary = getCartSummary();

  return (
    <div className="products-container">

      {!cartSummary.isEmpty && (
        <div className="cart-summary">
          <h3>Cart Summary</h3>
          <p>Items: {cartSummary.totalItems}</p>
          <p>Total: ${cartSummary.totalPrice.toFixed(2)}</p>
        </div>
      )}


      {authError && (
        <div className="error-banner">
          {authError}
        </div>
      )}

  
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;