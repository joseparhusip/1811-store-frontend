// src/pages/Home.jsx

import React from 'react';
// --- 1. Impor 'Link' untuk membuat navigasi ---
import { Link } from 'react-router-dom';
import '../css/Home.css';

// --- Mengimpor gambar statis ---
import imgShirtBlack from '../assets/img/img-shirt-black.png';
import imgMenStyle from '../assets/img/img-men-style-1811.png';
import imgWomenStyle from '../assets/img/img-women-style-1811.png';

// --- 2. Hapus data produk lokal dan impor dari sumber utama ---
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
  // Ambil 6 produk pertama untuk ditampilkan di beranda
  const featuredProducts = products.slice(0, 6);

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
        <div className="product-filters">
          <a href="#" className="filter-link active">All Products</a>
          <a href="#" className="filter-link">Women</a>
          <a href="#" className="filter-link">Men</a>
        </div>
        <div className="product-grid">
          {/* --- 3. Bungkus setiap kartu produk dengan <Link> --- */}
          {featuredProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
              <div className="product-card">
                {/* --- 4. Gunakan 'product.image' sesuai data dari products.js --- */}
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <div>
                    <h3 className="product-name">{product.name}</h3>
                    {/* --- 5. Format harga agar sesuai --- */}
                    <p className="product-price">{formatPrice(product.price)}</p>
                  </div>
                  <button className="add-to-cart-btn">🛒</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="load-more-container">
          <button className="btn btn-load-more">LOAD MORE</button>
        </div>
      </section>
    </div>
  );
};

export default Home;