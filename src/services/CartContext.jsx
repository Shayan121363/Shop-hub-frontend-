import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, updateQuantity, clearCart, selectCartItems, selectTotalItems, selectTotalPrice, selectItemQuantity, selectIsInCart} from '../auth/cartslice';
import { selectCurrentToken, selectIsAuthenticated } from '../auth/authSlice';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  

  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

 
  const checkAuth = () => {
    if (!isAuthenticated) {
      setError('Please login to access cart features');
      return false;
    }
    return true;
  };

  const addToCart = async (product, quantity = 1) => {
    if (!checkAuth()) {
      return { success: false, message: 'Authentication required' };
    }

    try {
      setLoading(true);
      setError(null);
      
  
      if (!product || !product.id) {
        throw new Error('Invalid product data');
      }


      dispatch(addItem({ product, quantity }));
      
      return { success: true, message: 'Item added to cart' };
    } catch (err) {
      const errorMsg = err.message || 'Failed to add item to cart';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };


  const removeFromCart = async (productId) => {
    if (!checkAuth()) {
      return { success: false, message: 'Authentication required' };
    }

    try {
      setLoading(true);
      setError(null);
      
      dispatch(removeItem(productId));
      
      return { success: true, message: 'Item removed from cart' };
    } catch (err) {
      const errorMsg = err.message || 'Failed to remove item';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    if (!checkAuth()) {
      return { success: false, message: 'Authentication required' };
    }

    try {
      setLoading(true);
      setError(null);
      
      if (quantity < 0) {
        throw new Error('Quantity cannot be negative');
      }
      
      dispatch(updateQuantity({ id: productId, quantity }));
      
      return { success: true, message: 'Quantity updated' };
    } catch (err) {
      const errorMsg = err.message || 'Failed to update quantity';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };


  const clearEntireCart = async () => {
    if (!checkAuth()) {
      return { success: false, message: 'Authentication required' };
    }

    try {
      setLoading(true);
      setError(null);
      
      dispatch(clearCart());
      
      return { success: true, message: 'Cart cleared' };
    } catch (err) {
      const errorMsg = err.message || 'Failed to clear cart';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantity = (productId) => {
    return useSelector(selectItemQuantity(productId));
  };


  const isInCart = (productId) => {
    return useSelector(selectIsInCart(productId));
  };

  const getCartSummary = () => {
    return {
      items: cartItems,
      totalItems,
      totalPrice,
      isEmpty: cartItems.length === 0,
      itemCount: cartItems.length
    };
  };

  const getTotalItems = () => totalItems;


  const getTotalPrice = () => totalPrice;

  const clearError = () => setError(null);

  const contextValue = {

    cartItems,
    totalItems,
    totalPrice,
    

    addToCart,
    removeFromCart,
    updateQuantity: updateItemQuantity,
    clearCart: clearEntireCart,
    

    getItemQuantity,
    isInCart,
    getCartSummary,
    getTotalItems,
    getTotalPrice,
    

    isAuthenticated: () => isAuthenticated,
    
  
    loading,
    error,
    clearError
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};