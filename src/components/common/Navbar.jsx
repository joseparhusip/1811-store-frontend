// src/components/common/Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Layout.css';
import logoImage from '../../assets/img/logo-1811-store.png';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };
  
  const closeAllMenus = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  return (
    <div className="sticky-header-wrapper">
      {/* Top Section */}
      <div className="navbar-top">
        <div className="navbar-top-container">
          <div className="navbar-top-left">
            <span>GOOD CLOTHES MADE FROM GOOD HAND</span>
          </div>
          <div className="navbar-top-right">
            <span>Help & FAQs</span>
            {user ? (
              <span>{user.email}</span>
            ) : (
              <span>My Account</span>
            )}
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo" onClick={closeAllMenus}>
            <img src={logoImage} alt="1811 Store Logo" className="logo-image" />
          </Link>

          <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={closeAllMenus}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/shop" className="nav-link" onClick={closeAllMenus}>Shop</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={closeAllMenus}>About</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={closeAllMenus}>Contact</Link>
            </li>
          </ul>
          
          <div className="nav-right-actions">
            <div className="nav-actions">
              {user ? (
                <div className="profile-menu-container">
                  <span className="nav-icon" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>👤</span>
                  {profileMenuOpen && (
                    <div className="profile-dropdown">
                      <Link to="/profile" className="dropdown-item" onClick={closeAllMenus}>Edit Profile</Link>
                      <button onClick={handleLogout} className="dropdown-item logout-button">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="nav-icon" onClick={closeAllMenus}>👤</Link>
              )}
              <Link to="/cart" className="nav-icon" onClick={closeAllMenus}>🛒</Link>
            </div>
            
            {/* =====================================================
              === INI SATU-SATUNYA PERUBAHAN DI FILE INI ===
              Menambahkan kelas 'active' saat menuOpen bernilai true
              =====================================================
            */}
            <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
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