// src/pages/Home.jsx

import React from 'react';
import '../css/Home.css';

// --- Mengimpor gambar ---
import imgShirtBlack from '../assets/img/img-shirt-black.png';
import imgMenStyle from '../assets/img/img-men-style-1811.png';
import imgWomenStyle from '../assets/img/img-women-style-1811.png';

// Impor gambar produk
import imgGoplay from '../assets/img/img-product/T-Shirt Goplay Outside.png';
import imgGoodCode from '../assets/img/img-product/T-Shirt good code.png';
import imgEvergreens from '../assets/img/img-product/T-Shirt Evergreens.png';
import imgFriends from '../assets/img/img-product/T-Shirt Most of My Friends.png';
import imgCat from '../assets/img/img-product/T-Shirt Tell Your Cat.png';
import imgCoffee from '../assets/img/img-product/T-Shirt Coffee Saves Lives.png';

// Data produk
const products = [
  { id: 1, name: 'T-Shirt Goplay Outside', price: 'Rp150.000', img: imgGoplay },
  { id: 2, name: 'T-Shirt good code', price: 'Rp200.000', img: imgGoodCode },
  { id: 3, name: 'T-Shirt Evergreens', price: 'Rp180.000', img: imgEvergreens },
  { id: 4, name: 'T-Shirt Most of My Friends', price: 'Rp130.000', img: imgFriends },
  { id: 5, name: 'T-Shirt Tell Your Cat', price: 'Rp200.000', img: imgCat },
  { id: 6, name: 'T-Shirt Coffee Saves Lives', price: 'Rp180.000', img: imgCoffee },
];


const Home = () => {
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
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.img} alt={product.name} className="product-image" />
              <div className="product-info">
                <div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                </div>
                <button className="add-to-cart-btn">🛒</button>
              </div>
            </div>
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