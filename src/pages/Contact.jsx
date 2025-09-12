// src/pages/Contact.jsx

import React from 'react';
import '../css/Contact.css'; // Pastikan CSS terhubung

// Impor gambar yang sama dengan halaman about untuk banner
import contactHeaderImage from '../assets/img/img-contact.png';

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Header Banner - Teks "CONTACT" sudah dihapus */}
      <header className="contact-header-banner" style={{ backgroundImage: `url(${contactHeaderImage})` }}>
        {/* KONTEN H1 DIHAPUS DARI SINI */}
      </header>

      {/* Wrapper untuk dua kolom konten */}
      <div className="contact-main-content">
        {/* Kolom Kiri: Form */}
        <div className="contact-box form-box">
          <h2>Send Us A Message</h2>
          <form className="contact-form">
            <div className="input-group">
              <span className="icon">✉️</span>
              <input type="email" placeholder="Your Email Address" required />
            </div>
            <div className="input-group">
               {/* Ikon sengaja dikosongkan agar sejajar */}
              <span className="icon"></span>
              <textarea placeholder="How Can We Help?" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn">SUBMIT</button>
          </form>
        </div>

        {/* Kolom Kanan: Info Kontak */}
        <div className="contact-box info-box">
          <div className="info-item">
            <span className="icon">📍</span>
            <div className="info-text">
              <h3>Address</h3>
              <p>Jl. Sariasih No.54, Sarijadi, Kec. Sukasari, Kota Bandung, Jawa Barat 40151</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">📞</span>
            <div className="info-text">
              <h3>Lets Talk</h3>
              <p>+6282213859516</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">📧</span>
            <div className="info-text">
              <h3>Sale Support</h3>
              <p>1811studioproduction@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;