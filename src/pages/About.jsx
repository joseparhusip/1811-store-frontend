// src/pages/About.jsx

import React, { useState, useEffect } from 'react'; // <-- Tambahkan useState & useEffect
import '../css/About.css';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/common/LoadingSpinner'; // <-- BARU: Impor spinner

// Impor gambar yang akan digunakan
import aboutHeaderImage from '../assets/img/img-about.png';
import storyImage1 from '../assets/img/img-product/T-Shirt From 1811-3.png';
import storyImage2 from '../assets/img/img-product/T-Shirt From 1811-1.png';

const About = () => {
  const { t } = useLanguage();

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

  // --- BARU: Tampilkan spinner jika isLoading true ---
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="about-container">
      <header className="about-header" style={{ backgroundImage: `url(${aboutHeaderImage})` }}>
      </header>

      <main className="about-content">
        {/* Bagian "Our Story" */}
        <section className="about-section">
          <h2 className="section-title">{t('about.ourStory')}</h2>
          <div className="image-content">
            <img src={storyImage1} alt="Story illustration 1" className="story-image" />
          </div>
          <div className="text-content">
            <p>{t('about.storyText1')}</p>
            <p>{t('about.storyText2')}</p>
            <p>{t('about.storyText3')}</p>
            <p>{t('about.storyText4')}</p>
          </div>
        </section>

        {/* Bagian "Our Mission" */}
        <section className="about-section reverse">
          <h2 className="section-title">{t('about.ourMission')}</h2>
          <div className="image-content">
            <img src={storyImage2} alt="Mission illustration 2" className="story-image" />
          </div>
          <div className="text-content">
            <p>{t('about.missionText1')}</p>
            <p>
              <strong>{t('about.missionTitle')}</strong>
            </p>
            <ul>
              <li>{t('about.mission1')}</li>
              <li>{t('about.mission2')}</li>
              <li>{t('about.mission3')}</li>
            </ul>
            <p>{t('about.missionText2')}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;