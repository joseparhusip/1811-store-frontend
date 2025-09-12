// src/components/common/Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Layout.css';
import logoImage from '../../assets/img/logo-1811-store.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // PERUBAHAN: Membungkus seluruh navbar dalam satu div untuk efek sticky
    <div className="sticky-header-wrapper">
      {/* Top Section */}
      <div className="navbar-top">
        <div className="navbar-top-container">
          <div className="navbar-top-left">
            <span>GOOD CLOTHES MADE FROM GOOD HAND</span>
          </div>
          <div className="navbar-top-right">
            <span>Help & FAQs</span>
            <span>My Account</span>
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img src={logoImage} alt="1811 Store Logo" className="logo-image" />
          </Link>

          <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/shop" className="nav-link" onClick={() => setMenuOpen(false)}>Shop</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>
            </li>
          </ul>
          
          <div className="nav-right-actions">
            <div className="nav-actions">
              <Link to="/account" className="nav-icon">👤</Link>
              <Link to="/cart" className="nav-icon">🛒</Link>
            </div>
            
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;