// src/components/common/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react';
// === PERUBAHAN: Mengimpor NavLink dari react-router-dom ===
import { Link, NavLink } from 'react-router-dom';
import '../../css/Layout.css';
import '../../css/Language.css'; // Import the language CSS
import logoImage from '../../assets/img/logo-1811-store.png';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  
  // Refs for click outside detection
  const languageRef = useRef(null);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };
  
  const closeAllMenus = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
    setLanguageMenuOpen(false);
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fungsi untuk mengganti bahasa
  const handleLanguageChange = (newLanguage) => {
    if (newLanguage !== language) {
      changeLanguage(newLanguage);
    }
    setLanguageMenuOpen(false);
  };

  const toggleLanguageMenu = (e) => {
    e.stopPropagation();
    setLanguageMenuOpen(!languageMenuOpen);
    setProfileMenuOpen(false); // Close profile menu if open
  };

  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setProfileMenuOpen(!profileMenuOpen);
    setLanguageMenuOpen(false); // Close language menu if open
  };

  return (
    <div className="sticky-header-wrapper">
      {/* Top Section */}
      <div className="navbar-top">
        <div className="navbar-top-container">
          <div className="navbar-top-left">
            <span>{t('navbar.tagline')}</span>
          </div>
          <div className="navbar-top-right">
            <span>{t('navbar.help')}</span>
            {user ? (
              <span>{user.email}</span>
            ) : (
              <span>{t('navbar.account')}</span>
            )}
            
            {/* Language Switcher */}
            <div className="language-switcher-container" ref={languageRef}>
              <div 
                className="language-switcher"
                onClick={toggleLanguageMenu}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleLanguageMenu(e);
                  }
                }}
              >
                <span>{language === 'id' ? '🇮🇩' : '🇺🇸'}</span>
                <span>{language.toUpperCase()}</span>
                <span style={{ fontSize: '8px', marginLeft: '2px' }}>▼</span>
              </div>
              {languageMenuOpen && (
                <div className="language-dropdown">
                  <button 
                    onClick={() => handleLanguageChange('id')}
                    className={`language-option ${language === 'id' ? 'active' : ''}`}
                  >
                    <span className="flag-desktop">🇮🇩</span>
                    <span className="lang-text-desktop">Indonesia</span>
                    <span className="lang-text-mobile">ID</span>
                  </button>
                  <button 
                    onClick={() => handleLanguageChange('en')}
                    className={`language-option ${language === 'en' ? 'active' : ''}`}
                  >
                    <span className="flag-desktop">🇺🇸</span>
                    <span className="lang-text-desktop">English</span>
                    <span className="lang-text-mobile">EN</span>
                  </button>
                </div>
              )}
            </div>
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
            {/* === PERUBAHAN: Menggunakan NavLink bukan Link === */}
            <li className="nav-item">
              <NavLink to="/" className="nav-link" onClick={closeAllMenus}>{t('navbar.home')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/shop" className="nav-link" onClick={closeAllMenus}>{t('navbar.shop')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link" onClick={closeAllMenus}>{t('navbar.about')}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link" onClick={closeAllMenus}>{t('navbar.contact')}</NavLink>
            </li>
          </ul>
          
          <div className="nav-right-actions">
            <div className="nav-actions">
              {user ? (
                <div className="profile-menu-container" ref={profileRef}>
                  <span 
                    className="nav-icon" 
                    onClick={toggleProfileMenu}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleProfileMenu(e);
                      }
                    }}
                  >
                    👤
                  </span>
                  {profileMenuOpen && (
                    <div className="profile-dropdown">
                      <Link to="/profile" className="dropdown-item" onClick={closeAllMenus}>
                        Edit Profile
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item logout-button">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="nav-icon" onClick={closeAllMenus}>👤</Link>
              )}
              <Link to="/cart" className="nav-icon" onClick={closeAllMenus}>🛒</Link>
            </div>
            
            <div 
              className={`hamburger ${menuOpen ? 'active' : ''}`} 
              onClick={() => setMenuOpen(!menuOpen)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setMenuOpen(!menuOpen);
                }
              }}
            >
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