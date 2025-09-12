// src/pages/About.jsx

import React from 'react';
import '../css/About.css'; // Impor CSS khusus untuk halaman ini

// Impor gambar yang akan digunakan
import aboutHeaderImage from '../assets/img/img-about.png';
import storyImage1 from '../assets/img/img-product/T-Shirt From 1811-3.png';
import storyImage2 from '../assets/img/img-product/T-Shirt From 1811-1.png';

const About = () => {
  return (
    <div className="about-container">
      {/* Bagian Header - Teks "ABOUT" sudah dihapus */}
      <header className="about-header" style={{ backgroundImage: `url(${aboutHeaderImage})` }}>
        {/* Konten h1 sengaja dikosongkan/dihapus sesuai permintaan */}
      </header>

      {/* Konten utama halaman */}
      <main className="about-content">
        {/* Bagian "Our Story" */}
        <section className="about-section">
          <div className="text-content">
            <h2>OUR STORY</h2>
            <p>
              The name 1811 from the year of birth of Raden Saleh, a great Indonesian artist. We are inspired by
              the belief that art is a way for humans to freely express their feelings.
            </p>
            <p>
              In the name 1811, we want to bring that spirit into each of our works. We believe that everyone has
              feelings, and has the right to express them—one way being through what they wear.
            </p>
            <p>
              We don't just make clothes; you can create designs that hold meaning, that can become part of
              your story and lifestyle.
            </p>
            <p>
              Thus, Good Clothes Made From Good Hand.
            </p>
          </div>
          <div className="image-content">
            <img src={storyImage1} alt="Story illustration 1" className="story-image" />
          </div>
        </section>

        {/* Bagian "Our Mission" */}
        <section className="about-section reverse">
          <div className="text-content">
            <h2>OUR MISSION</h2>
            <p>
              Our mission at 1811 is to bring the spirit of art into everyday life through meaningful and unique designs.
            </p>
            {/* Teks diubah menjadi daftar agar lebih rapi */}
            <p>
              <strong>We aim to:</strong>
            </p>
            <ul>
              <li>Create clothing that is not only comfortable but also tells a story.</li>
              <li>Provide a space for everyone to express themselves freely.</li>
              <li>Elevate Indonesian art and culture into contemporary style.</li>
            </ul>
            <p>
              We believe that everyone is unique, and clothing can be a way to show who we truly are.
              Every 1811 product is crafted with care, attention to detail, and a message to convey.
            </p>
          </div>
          <div className="image-content">
            <img src={storyImage2} alt="Mission illustration 2" className="story-image" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;