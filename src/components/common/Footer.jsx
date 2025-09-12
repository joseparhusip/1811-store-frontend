// src/components/common/Footer.jsx

import React from 'react';
import '../../css/Layout.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>CATEGORIES</h4>
          <ul>
            <li><a href="#">Women</a></li>
            <li><a href="#">Men</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>HELP</h4>
          <ul>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        
        <div className="footer-section get-in-touch">
          <h4>GET IN TOUCH</h4>
          <p>Any questions? Let us know in store 1811, Jl. Sariasih No.54, Sarijadi, Kec. Sukasari, Kota Bandung, Jawa Barat 40151</p>
          <p className="phone">Call us on<br />+6282213859516</p>
        </div>
        
        <div className="footer-section newsletter">
          <h4>NEWSLETTER</h4>
          <p>1811studioproduction@gmail.com</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#" className="social-icon">🎵</a> {/* TikTok */}
          <a href="#" className="social-icon">📷</a> {/* Instagram */}
          <a href="#" className="social-icon">📘</a> {/* Facebook */}
          <a href="#" className="social-icon">💬</a> {/* WhatsApp */}
        </div>
        <p className="copyright">Copyright © 1811 2025 All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;