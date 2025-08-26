import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../auth/authSlice';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle, Eye, EyeOff, UserPlus } from 'lucide-react';

const API_BASE_URL = 'http://localhost:4000/api';

const Login = ({ onUserDataUpdate }) => {
    const dispatch = useDispatch();
    

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password || (isRegistering && !name)) {
            setMessage({ 
                type: 'error', 
                text: `Please fill in all ${isRegistering ? 'fields' : 'required fields'}` 
            });
            return;
        }

        if (isRegistering && password.length < 6) {
            setMessage({ 
                type: 'error', 
                text: 'Password must be at least 6 characters long' 
            });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        const endpoint = isRegistering ? '/auth/register' : '/auth/login';
        const payload = isRegistering 
            ? { name: name.trim(), email: email.trim(), password }
            : { email: email.trim(), password };

        try {
            const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 
            });
            
            const { token, user, message: serverMessage } = response.data;
            console.log(response.data,token)
           
            localStorage.setItem("token", JSON.stringify(token));
            
            setMessage({ 
                type: 'success', 
                text: serverMessage || `${isRegistering ? 'Registration' : 'Login'} successful! Loading profile...` 
            });
            

            dispatch(setCredentials({ user, token }));
            
   
            if (onUserDataUpdate) {
                onUserDataUpdate(user);
            }
            
            setMessage({ 
                type: 'success', 
                text: `Welcome ${user.name}! Redirecting...` 
            });

      
            setEmail('');
            setPassword('');
            setName('');
            
            console.log(`${isRegistering ? 'Registration' : 'Login'} Successful`, response.data);
            
        } catch (error) {
            console.error(`${isRegistering ? 'Registration' : 'Login'} failed`, error);
            
            let errorMessage = 'An unexpected error occurred. Please try again.';
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = 'Unable to connect to server. Please check if the server is running.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Please check your internet connection.';
            }
            
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };


    const fillDemoCredentials = () => {
        setEmail('john@mail.com');
        setPassword('changeme');
        setName('John Doe');
        setMessage({ type: 'info', text: 'Demo credentials filled. Click login to continue.' });
    };


    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setMessage({ type: '', text: '' });
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        {isRegistering ? <UserPlus size={32} /> : <LogIn size={32} />}
                    </div>
                    <h2>{isRegistering ? 'Create Your Account' : 'Sign In to Your Account'}</h2>
                    <p>
                        {isRegistering 
                            ? 'Enter your details to create a new account'
                            : 'Enter your credentials to access your cart and account'
                        }
                    </p>
                </div>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.type === 'error' && <AlertCircle size={16} />}
                        {message.type === 'success' && <CheckCircle size={16} />}
                        {message.type === 'info' && <AlertCircle size={16} />}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    {isRegistering && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-group">
                                {/* <UserPlus className="input-icon" size={18} /> */}
                                <input 
                                    id="name"
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="form-input"
                                    disabled={isLoading}
                                    required={isRegistering}
                                    minLength="2"
                                    maxLength="50"
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-group">
                            {/* <Mail className="input-icon" size={18} /> */}
                            <input 
                                id="email"
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="form-input"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-group">
                            {/* <Lock className="input-icon" size={1} /> */}
                            <input 
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isRegistering ? "Create a password " : "Enter password"}
                                className="form-input"
                                disabled={isLoading}
                                required
                                minLength={isRegistering ? "8" : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={`login-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="loading-spinner"></div>
                                {isRegistering ? 'Creating Account...' : 'Signing In...'}
                            </>
                        ) : (
                            <>
                                {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
                                {isRegistering ? 'Create Account' : 'Sign In'}
                            </>
                        )}
                    </button>
                </form>

            
                <div className="mode-toggle">
                    <p>
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        <button 
                            type="button"
                            onClick={toggleMode}
                            className="toggle-btn"
                            disabled={isLoading}
                        >
                            {isRegistering ? 'Sign In' : 'Create Account'}
                        </button>
                    </p>
                </div>

                {/* {!isRegistering && (
                    <div className="demo-section">
                        <span>or</span>
                        <button 
                            type="button" 
                            onClick={fillDemoCredentials}
                            className="demo-btn"
                            disabled={isLoading}
                        >
                            Use Demo Credentials
                        </button>
                        <div className="demo-info">
                            <p><strong>Demo Accounts:</strong></p>
                            <p> john@mail.com (User)</p>
                            <p> demo@example.com (User)</p>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default Login;