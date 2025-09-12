// src/components/common/Footer.jsx

import React, { useState } from 'react';
import '../../css/Layout.css';

// Import your social media icons
import tiktokIcon from '../../assets/icons/tiktok.png';
import instagramIcon from '../../assets/icons/instagram.png';
import facebookIcon from '../../assets/icons/facebook.png';
import whatsappIcon from '../../assets/icons/whatsapp.png';

const Footer = () => {
  // === LOGIKA BARU UNTUK FLOATING ACTION BUTTON ===
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Nomor WhatsApp tetap sama
  const phoneNumber = "6282213859516";
  
  // Pesan otomatis WhatsApp tetap sama
  const whatsappMessage = `Halo Admin 1811 Studio yang baik, saya mau custom baju yang bagus dong! Bisa bantu saya mewujudkan desain impian saya?

Nama: 
No Wa: 
Ukuran Size: 
Pcs: 
Lampiran gambar: `;

  // Encode pesan untuk URL
  const encodedMessage = encodeURIComponent(whatsappMessage);

  // Fungsi untuk menangani share menggunakan Web Share API
  const handleShare = async () => {
    const shareData = {
      title: '1811 Store',
      text: 'Cek koleksi pakaian keren dan custom desain di 1811 Store!',
      url: window.location.href, // Bagikan URL halaman saat ini
    };

    try {
      // Cek apakah browser mendukung navigator.share
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback untuk browser yang tidak mendukung (misal: desktop)
        alert("Fitur share tidak didukung di browser ini. Silakan salin link secara manual.");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };


  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* === PERUBAHAN: Menghilangkan div .footer-links-group === */}
          {/* SEKARANG SETIAP .footer-section MENJADI ITEM GRID LANGSUNG */}
          
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
            <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer"><img src={tiktokIcon} alt="TikTok" /></a>
            <a href="https://www.instagram.com/1811.studio?igsh=MWFqd3B3amVzMW8xcA==" className="social-icon" target="_blank" rel="noopener noreferrer"><img src={instagramIcon} alt="Instagram" /></a>
            <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer"><img src={facebookIcon} alt="Facebook" /></a>
            <a href={`https://wa.me/${phoneNumber}`} className="social-icon" target="_blank" rel="noopener noreferrer"><img src={whatsappIcon} alt="WhatsApp" /></a>
          </div>
          <p className="copyright">Copyright © 1811 2025 All rights reserved</p>
        </div>
      </footer>

      {/* === STRUKTUR BARU: FLOATING ACTION MENU === */}
      <div className={`floating-action-container ${isMenuOpen ? 'active' : ''}`}>
        {/* Tombol Opsi Share */}
        <button className="floating-option share-btn" onClick={handleShare}>
          <span>🔗</span>
        </button>
        
        {/* Tombol Opsi WhatsApp */}
        <a 
          href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
          className="floating-option whatsapp-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={whatsappIcon} alt="WhatsApp" />
        </a>

        {/* Tombol Aksi Utama (Toggle) */}
        <button className="floating-action-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {/* Ikon berubah dari '+' menjadi '×' saat menu terbuka */}
          <span className="icon">{isMenuOpen ? '×' : '+'}</span>
        </button>
      </div>
    </>
  );
};

export default Footer;