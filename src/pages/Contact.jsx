// src/pages/Contact.jsx

import React, { useState, useEffect } from 'react'; // <-- Tambahkan useEffect
import '../css/Contact.css';
import { useLanguage } from '../context/LanguageContext';
import contactHeaderImage from '../assets/img/img-contact.png';
import LoadingSpinner from '../components/common/LoadingSpinner'; // <-- BARU: Impor spinner

const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- BARU: State untuk mengelola status loading ---
  const [isLoading, setIsLoading] = useState(true);

  // --- BARU: useEffect untuk simulasi proses loading ---
  useEffect(() => {
    // Simulasi loading selama 1.5 detik
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Cleanup function
    return () => clearTimeout(loadingTimer);
  }, []); // Dijalankan sekali saat komponen mount

  // Fungsi untuk menangani event submit form
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  // --- BARU: Tampilkan spinner jika isLoading true ---
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="contact-page">
      <header className="contact-header-banner" style={{ backgroundImage: `url(${contactHeaderImage})` }}>
        {/* Konten header */}
      </header>

      <div className="contact-main-content">
        <div className="contact-box form-box">
          {/* Tampilkan pesan atau form berdasarkan state isSubmitted */}
          {isSubmitted ? (
            <div className="thank-you-message">
              <h2>{t('contact.thankYou')} ✅</h2>
              <p>{t('contact.messageSuccess')}</p>
            </div>
          ) : (
            <>
              <h2>{t('contact.sendMessage')}</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <span className="icon">📧</span>
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
            <span className="icon">✉️</span>
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