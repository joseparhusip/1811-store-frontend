// src/pages/Contact.jsx

import React, { useState } from 'react'; // 1. Impor useState
import '../css/Contact.css';
import contactHeaderImage from '../assets/img/img-contact.png';

const Contact = () => {
  // 2. Tambahkan state untuk melacak status pengiriman form
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 3. Buat fungsi untuk menangani event submit form
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
          {/* 4. Tampilkan pesan atau form berdasarkan state isSubmitted */}
          {isSubmitted ? (
            // Jika form sudah disubmit, tampilkan pesan ini
            <div className="thank-you-message">
              <h2>Terima Kasih! 🙏</h2>
              <p>Pesan Anda telah berhasil terkirim. Kami akan segera menghubungi Anda kembali.</p>
            </div>
          ) : (
            // Jika form belum disubmit, tampilkan form ini
            <>
              <h2>Send Us A Message</h2>
              {/* 5. Panggil fungsi handleSubmit saat form disubmit */}
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <span className="icon">✉️</span>
                  <input type="email" placeholder="Your Email Address" required />
                </div>
                <div className="input-group">
                  <span className="icon"></span>
                  <textarea placeholder="How Can We Help?" rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-btn">SUBMIT</button>
              </form>
            </>
          )}
        </div>

        {/* Kolom Kanan: Info Kontak (Tidak ada perubahan di sini) */}
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