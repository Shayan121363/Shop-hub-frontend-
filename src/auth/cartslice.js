import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    items: [],            
    status: 'idle',       
    error: null           
};


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      
        addItem: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += quantity; 
            } else {
                state.items.push({ ...product, quantity }); 
            }
        },

     
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },

     
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);

            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(item => item.id !== id); 
                } else {
                    item.quantity = quantity; 
                }
            }
        },

        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;


export default cartSlice.reducer;


export const selectCartItems = (state) => state.cart.items;

export const selectTotalItems = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export const selectItemQuantity = (productId) => (state) => 
  state.cart.items.find(item => item.id === productId)?.quantity || 0;


export const selectIsInCart = (productId) => (state) => 
  state.cart.items.some(item => item.id === productId);