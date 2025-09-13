// src/pages/SignUp.jsx

import React, { useState, useEffect } from 'react'; // <-- MODIFIKASI
import { Link } from 'react-router-dom';
import '../css/Auth.css';
import logoImage from '../assets/img/logo-1811-store.png';
import LoadingSpinner from '../components/common/LoadingSpinner'; // <-- BARU

const SignUp = () => {
  // --- BARU: State dan Effect untuk loading ---
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Form tidak perlu loading lama
    return () => clearTimeout(timer);
  }, []);
  // ------------------------------------------

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signing up with:', { username, email, phone, password });
  };

  // --- BARU: Render loading spinner ---
  if (isLoading) {
    return <LoadingSpinner />;
  }
  // ---------------------------------

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logoImage} alt="1811 Studio Logo" className="auth-logo" />
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Nomor handphone</label>
            <input type="tel" id="phone" placeholder="Enter your Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="auth-button">SIGNUP</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;