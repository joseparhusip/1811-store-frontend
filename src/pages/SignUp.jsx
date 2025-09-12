// src/pages/SignUp.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Auth.css';
import logoImage from '../assets/img/logo-1811-store.png';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika untuk mendaftarkan user baru
    console.log('Signing up with:', { username, email, phone, password });
    // Setelah berhasil, Anda bisa arahkan user ke halaman login
    // navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logoImage} alt="1811 Studio Logo" className="auth-logo" />
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

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
            <label htmlFor="phone">Nomor handphone</label>
            <input 
              type="tel" 
              id="phone" 
              placeholder="Enter your Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-button">SIGNUP</button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;