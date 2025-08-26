import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,                              
    token: localStorage.getItem('token'),      
    status: 'idle',                            
    error: null                                
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem('token', token); 
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token'); 
        },

        setUserData: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },

        setLoading: (state, action) => {
            state.status = action.payload ? 'loading' : 'idle';
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },

        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { 
    setCredentials, 
    logout, 
    setUserData, 
    setLoading, 
    setError, 
    clearError 
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.token != null; 
export const selectUserRole = (state) => state.auth.user?.role || 'user';
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;