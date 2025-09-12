// src/pages/Home.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

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
  // --- State untuk filter dan produk yang ditampilkan ---
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayedProducts, setDisplayedProducts] = useState(products.slice(0, 6));

  // --- Fungsi untuk menangani klik pada filter ---
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      // Jika 'all', tampilkan 6 produk pertama
      setDisplayedProducts(products.slice(0, 6));
    } else {
      // Filter produk berdasarkan kategori
      const filtered = products.filter(product => 
        product.category.toLowerCase() === filter.toLowerCase()
      );
      setDisplayedProducts(filtered);
    }
  };

  // --- Fungsi untuk Load More ---
  const handleLoadMore = () => {
    if (activeFilter === 'all') {
      // Jika filter 'all', tambah 3 produk lagi
      const currentLength = displayedProducts.length;
      const nextProducts = products.slice(currentLength, currentLength + 3);
      setDisplayedProducts(prev => [...prev, ...nextProducts]);
    }
    // Untuk filter kategori, semua sudah ditampilkan
  };

  return (
    <div className="home-container">
      {/* Bagian Hero */}
      <header className="hero-section">
        <img src={imgShirtBlack} alt="New Arrivals T-Shirt" className="hero-image" />
        <div className="hero-content">
          <p>Men Collection from 1811</p>
          <h1>NEW ARRIVALS</h1>
          <button className="btn btn-shop-now">SHOP NOW</button>
        </div>
        <button className="btn btn-design">Design Your T-Shirt</button>
      </header>

      {/* Bagian Kategori */}
      <section className="category-preview">
        <div className="category-card women" style={{backgroundImage: `url(${imgWomenStyle})`}}>
          <div className="card-content">
            <h2>WOMEN</h2>
            <p>1811 style</p>
          </div>
        </div>
        <div className="category-card men" style={{backgroundImage: `url(${imgMenStyle})`}}>
           <div className="card-content">
            <h2>MEN</h2>
            <p>1811 style</p>
          </div>
        </div>
      </section>

      {/* Bagian Product Overview */}
      <section className="product-overview">
        <div className="product-header">
            <h2>PRODUCT OVERVIEW</h2>
            <button className="btn btn-design-alt">Design Your T-Shirt</button>
        </div>

        {/* Filter Buttons dengan Logic */}
        <div className="product-filters">
          <button 
            onClick={() => handleFilterChange('all')} 
            className={`filter-link ${activeFilter === 'all' ? 'active' : ''}`}
          >
            All Products ({products.length})
          </button>
          <button 
            onClick={() => handleFilterChange('women')} 
            className={`filter-link ${activeFilter === 'women' ? 'active' : ''}`}
          >
            Women ({products.filter(p => p.category === 'Women').length})
          </button>
          <button 
            onClick={() => handleFilterChange('men')} 
            className={`filter-link ${activeFilter === 'men' ? 'active' : ''}`}
          >
            Men ({products.filter(p => p.category === 'Men').length})
          </button>
        </div>

        {/* Render produk dari state 'displayedProducts' */}
        <div className="product-grid">
          {displayedProducts.length > 0 ? (
            displayedProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                <div className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-info">
                    <div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">{formatPrice(product.price)}</p>
                      <p className="product-category">Category: {product.category}</p>
                    </div>
                    <button className="add-to-cart-btn">🛒</button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-products">
              <p>Tidak ada produk dalam kategori ini.</p>
            </div>
          )}
        </div>
        
        {/* Load More Button - hanya tampil jika filter 'all' dan masih ada produk */}
        {activeFilter === 'all' && displayedProducts.length < products.length && (
          <div className="load-more-container">
            <button 
              className="btn btn-load-more" 
              onClick={handleLoadMore}
            >
              LOAD MORE
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;