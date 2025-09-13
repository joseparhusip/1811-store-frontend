// src/pages/Contact.jsx

import React, { useState } from 'react';
import '../css/Contact.css';
import { useLanguage } from '../context/LanguageContext'; // Import language context
import contactHeaderImage from '../assets/img/img-contact.png';

const Contact = () => {
  const { t } = useLanguage(); // Gunakan language context
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fungsi untuk menangani event submit form
  const handleSubmit = (event) => {
    event.preventDefault(); // Mencegah halaman reload saat form disubmit
    // Di sini Anda bisa menambahkan logika pengiriman data ke server jika perlu
    setIsSubmitted(true); // Ubah state menjadi true
  };

  return (
    <div className="contact-page">
      <header className="contact-header-banner" style={{ backgroundImage: `url(${contactHeaderImage})` }}>
        {/* Konten header */}
      </header>

      <div className="contact-main-content">
        <div className="contact-box form-box">
          {/* Tampilkan pesan atau form berdasarkan state isSubmitted */}
          {isSubmitted ? (
            // Jika form sudah disubmit, tampilkan pesan ini
            <div className="thank-you-message">
              <h2>{t('contact.thankYou')} 🙏</h2>
              <p>{t('contact.messageSuccess')}</p>
            </div>
          ) : (
            // Jika form belum disubmit, tampilkan form ini
            <>
              <h2>{t('contact.sendMessage')}</h2>
              {/* Panggil fungsi handleSubmit saat form disubmit */}
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <span className="icon">✉️</span>
                  <input 
                    type="email" 
                    placeholder={t('contact.yourEmail')} 
                    required 
                  />
                </div>
                <div className="input-group">
                  <span className="icon">💬</span>
                  <textarea 
                    placeholder={t('contact.howCanHelp')} 
                    rows="5" 
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  {t('contact.submit')}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Kolom Kanan: Info Kontak */}
        <div className="contact-box info-box">
          <div className="info-item">
            <span className="icon">📍</span>
            <div className="info-text">
              <h3>{t('contact.address')}</h3>
              <p>Jl. Sariasih No.54, Sarijadi, Kec. Sukasari, Kota Bandung, Jawa Barat 40151</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">📞</span>
            <div className="info-text">
              <h3>{t('contact.letsTalk')}</h3>
              <p>+6282213859516</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">📧</span>
            <div className="info-text">
              <h3>{t('contact.saleSupport')}</h3>
              <p>1811studioproduction@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;