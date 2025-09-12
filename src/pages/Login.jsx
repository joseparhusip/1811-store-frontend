// src/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // pastikan ekstensi .jsx
import '../css/Auth.css';
import logoImage from '../assets/img/logo-1811-store.png';

const Login = () => {
  // Kita mulai dengan input kosong agar pengguna bisa mengetik
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  
  // Hapus useNavigate karena sudah dihandle di context

  const handleSubmit = (e) => {
    e.preventDefault();
    // Panggil fungsi login dari context dengan email dan password
    login({ email, password }); 
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logoImage} alt="1811 Studio Logo" className="auth-logo" />
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <span className="password-eye-icon">👁️</span>
            </div>
          </div>
          
          <div className="form-options">
            <a href="#" className="forgot-password">Forget Password?</a>
          </div>

          <button type="submit" className="auth-button">LOGIN</button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;