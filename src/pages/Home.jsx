// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import AdPopup from '../components/common/AdPopup';
import { useLanguage } from '../context/LanguageContext';

// --- Impor komponen LoadingSpinner ---
import LoadingSpinner from '../components/common/LoadingSpinner';

// --- Mengimpor gambar statis ---
import imgShirtBlack from '../assets/img/img-shirt-black.png';
import imgMenStyle from '../assets/img/img-men-style-1811.png';
import imgWomenStyle from '../assets/img/img-women-style-1811.png';

// --- Impor data produk dari sumber utama ---
import { products } from '../data/products';

// --- Fungsi untuk memformat harga ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const Home = () => {
  const { t } = useLanguage();
  
  // --- State untuk mengelola status loading ---
  const [isLoading, setIsLoading] = useState(true);

  // --- State untuk filter dan produk yang ditampilkan ---
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayedProducts, setDisplayedProducts] = useState(products.slice(0, 6));
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  // --- useEffect untuk simulasi proses loading ---
  useEffect(() => {
    // Timer ini mensimulasikan pengambilan data dari server.
    // Durasi 2500ms (2.5 detik) untuk halaman utama.
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Cleanup function untuk membersihkan timer
    return () => clearTimeout(loadingTimer);
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali

  // --- useEffect untuk memeriksa status login dan menampilkan notifikasi ---
  useEffect(() => {
    const justLoggedIn = localStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
      setShowLoginSuccess(true);
      localStorage.removeItem('justLoggedIn');
      const timer = setTimeout(() => {
        setShowLoginSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // --- useEffect untuk mengunci scroll body saat pop-up aktif ---
  useEffect(() => {
    if (isPopupVisible && !isLoading) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isPopupVisible, isLoading]);
  
  // --- Fungsi untuk menutup pop-up ---
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  // --- Fungsi untuk menangani klik pada filter ---
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setDisplayedProducts(products.slice(0, 6));
    } else {
      const filtered = products.filter(product => 
        product.category.toLowerCase() === filter.toLowerCase()
      );
      setDisplayedProducts(filtered);
    }
  };

  // --- Fungsi untuk Load More ---
  const handleLoadMore = () => {
    if (activeFilter === 'all') {
      const currentLength = displayedProducts.length;
      const nextProducts = products.slice(currentLength, currentLength + 3);
      setDisplayedProducts(prev => [...prev, ...nextProducts]);
    }
  };
  
  // --- Tampilkan spinner jika isLoading true ---
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Jika loading selesai, tampilkan konten halaman seperti biasa
  return (
    <div className="home-container">
      {/* Render komponen pop-up */}
      <AdPopup isVisible={isPopupVisible} onClose={handleClosePopup} />

      {/* Tampilkan notifikasi jika state true */}
      {showLoginSuccess && (
        <div className="login-success-notification">
          {t('auth.loginSuccess')}
        </div>
      )}

      {/* Bagian Hero */}
      <header className="hero-section">
        <img src={imgShirtBlack} alt="New Arrivals T-Shirt" className="hero-image" />
        <div className="hero-content">
          <p>{t('home.menCollection')}</p>
          <h1>{t('home.newArrivals')}</h1>
          <Link to="/shop" className="btn btn-shop-now">{t('home.shopNow')}</Link>
        </div>
        <Link to="/custom-shirt" className="btn btn-design">{t('home.designTshirt')}</Link>
      </header>

      {/* Bagian Kategori */}
      <section className="category-preview">
        <div className="category-card women" style={{backgroundImage: `url(${imgWomenStyle})`}}>
          <div className="card-content">
            <h2>{t('home.women')}</h2>
            <p>{t('home.style')}</p>
          </div>
        </div>
        <div className="category-card men" style={{backgroundImage: `url(${imgMenStyle})`}}>
           <div className="card-content">
            <h2>{t('home.men')}</h2>
            <p>{t('home.style')}</p>
          </div>
        </div>
      </section>

      {/* Bagian Product Overview */}
      <section className="product-overview">
        <div className="product-header">
            <h2>{t('home.productOverview')}</h2>
            <Link to="/custom-shirt" className="btn btn-design-alt">{t('home.designTshirt')}</Link>
        </div>

        <div className="product-filters">
          <button 
            onClick={() => handleFilterChange('all')} 
            className={`filter-link ${activeFilter === 'all' ? 'active' : ''}`}
          >
            {t('home.allProducts')} ({products.length})
          </button>
          <button 
            onClick={() => handleFilterChange('women')} 
            className={`filter-link ${activeFilter === 'women' ? 'active' : ''}`}
          >
            {t('home.women')} ({products.filter(p => p.category === 'Women').length})
          </button>
          <button 
            onClick={() => handleFilterChange('men')} 
            className={`filter-link ${activeFilter === 'men' ? 'active' : ''}`}
          >
            {t('home.men')} ({products.filter(p => p.category === 'Men').length})
          </button>
        </div>

        <div className="product-grid">
          {displayedProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
              <div className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>
                    <p className="product-category">{t('home.category')}: {product.category}</p>
                  </div>
                  <button className="add-to-cart-btn">🛒</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {activeFilter === 'all' && displayedProducts.length < products.length && (
          <div className="load-more-container">
            <button className="btn btn-load-more" onClick={handleLoadMore}>
              {t('home.loadMore')}
            </button>
          </div>
        )}
      </section>

      {/* Bagian Video */}
      <section className="video-section">
        <h2>{t('home.videoTitle')}</h2>
        <div className="video-grid">
          <div className="video-item">
            <iframe 
              src="https://www.instagram.com/reel/DJ_BZbpSHjy/embed/?utm_source=ig_embed&amp;utm_campaign=loading" 
              frameBorder="0" allowFullScreen scrolling="no" allowTransparency="true"
              title="Instagram Reel 1" loading="lazy">
            </iframe>
          </div>
          <div className="video-item">
            <iframe 
              src="https://www.instagram.com/reel/DKTr9wry4xK/embed/?utm_source=ig_embed&amp;utm_campaign=loading" 
              frameBorder="0" allowFullScreen scrolling="no" allowTransparency="true"
              title="Instagram Reel 2" loading="lazy">
            </iframe>
          </div>
          <div className="video-item">
            <iframe 
              src="https://www.instagram.com/reel/DMLDVSfyYdo/embed/?utm_source=ig_embed&amp;utm_campaign=loading" 
              frameBorder="0" allowFullScreen scrolling="no" allowTransparency="true"
              title="Instagram Reel 3" loading="lazy">
            </iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;