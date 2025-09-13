// src/components/common/Footer.jsx

import React, { useState } from 'react';
import '../../css/Layout.css';
import { useLanguage } from '../../context/LanguageContext'; // Import language context

// Import your social media icons
import tiktokIcon from '../../assets/icons/tiktok.png';
import instagramIcon from '../../assets/icons/instagram.png';
import facebookIcon from '../../assets/icons/facebook.png';
import whatsappIcon from '../../assets/icons/whatsapp.png';

const Footer = () => {
  const { t } = useLanguage(); // Gunakan language context
  
  // === LOGIKA BARU UNTUK FLOATING ACTION BUTTON ===
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Nomor WhatsApp tetap sama
  const phoneNumber = "6282213859516";
  
  // Pesan otomatis WhatsApp dengan multi-bahasa
  const whatsappMessage = t('footer.whatsappMessage') || 
    `Halo Admin 1811 Studio yang baik, saya mau custom baju yang bagus dong! Bisa bantu saya mewujudkan desain impian saya?

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
          <div className="footer-section">
            <h4>{t('footer.categories')}</h4>
            <ul>
              <li><a href="#">{t('home.women')}</a></li>
              <li><a href="#">{t('home.men')}</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.help')}</h4>
            <ul>
              <li><a href="#">{t('footer.trackOrder')}</a></li>
              <li><a href="#">{t('footer.returns')}</a></li>
              <li><a href="#">{t('footer.faqs')}</a></li>
            </ul>
          </div>

          <div className="footer-section get-in-touch">
            <h4>{t('footer.getInTouch')}</h4>
            <p>{t('footer.contactText')}</p>
            <p className="phone">{t('footer.callUs')}<br />+6282213859516</p>
          </div>
          <div className="footer-section newsletter">
            <h4>{t('footer.newsletter')}</h4>
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
          <p className="copyright">{t('footer.copyright')}</p>
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