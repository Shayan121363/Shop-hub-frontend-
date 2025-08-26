import React from 'react';
import { useCart } from './CartContext';
import {  ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShoppingBag, AlertCircle} from 'lucide-react';

const CartPage = ({ onBackToProducts }) => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart, loading, error, clearError} 
  = useCart();

  const handleQuantityChange = async (productId, newQuantity) => {
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <button className="back-btn" onClick={onBackToProducts}>
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
          <h1>Shopping Cart</h1>
        </div>

        <div className="empty-cart">
          <ShoppingBag size={64} className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button className="shop-now-btn" onClick={onBackToProducts}>
            <ShoppingCart size={20} />
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={onBackToProducts}>
          <ArrowLeft size={20} />
          Continue Shopping
        </button>
        <h1>Shopping Cart ({totalItems} items)</h1>
        <button 
          className="clear-cart-btn" 
          onClick={handleClearCart}
          disabled={loading}
        >
          <Trash2 size={18} />
          Clear Cart
        </button>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={clearError} className="close-error">Ã—</button>
        </div>
      )}

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.title} />
              </div>
              
              <div className="item-details">
                <h3 className="item-title">{item.title}</h3>
                <p className="item-category">{item.category}</p>
                <div className="item-price">
                  <span className="price">${item.price}</span>
                  <span className="total-price">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="item-actions">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={loading || item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="quantity">{item.quantity}</span>
                  
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={loading}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={loading}
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-line">
              <span>Items ({totalItems}):</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="summary-line">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            
            <div className="summary-line-tax">
              <span>Tax:</span>
              <span>${(totalPrice * 0.08).toFixed(2)}</span>
            </div>
            
            <div className="summary-line-total">
              <span>Total:</span>
              <span>${(totalPrice * 1.08).toFixed(2)}</span>
            </div>

            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;