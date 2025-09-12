// src/components/common/Navbar.jsx

import React, { useState } from 'react'; // PERUBAHAN: Impor useState
import '../../css/Layout.css';
import logoImage from '../../assets/img/logo-1811-store.png';

const Navbar = () => {
  // PERUBAHAN: Tambahkan state untuk mengontrol visibilitas menu mobile
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top Section (Tidak ada perubahan) */}
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
          <a href="/" className="nav-logo">
            <img src={logoImage} alt="1811 Store Logo" className="logo-image" />
          </a>

          {/* PERUBAHAN: Tambahkan class 'active' secara kondisional */}
          <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <a href="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</a>
            </li>
            <li className="nav-item">
              <a href="/shop" className="nav-link" onClick={() => setMenuOpen(false)}>Shop</a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</a>
            </li>
          </ul>
          
          <div className="nav-right-actions">
            <div className="nav-actions">
              <div className="nav-icon">👤</div>
              <div className="nav-icon">🛒</div>
            </div>
            
            {/* PERUBAHAN: Tambahkan tombol hamburger */}
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;