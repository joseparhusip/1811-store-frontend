// src/pages/Shop.jsx

import React from 'react';

// --- DIHAPUS: Komponen Navbar dan Footer tidak perlu diimpor lagi ---
// import Navbar from '../components/common/Navbar';
// import Footer from '../components/common/Footer';

// Impor komponen dan data yang relevan untuk halaman ini saja
import ProductCard from '../components/shop/ProductCard';
import { products } from '../data/products'; // Pastikan path ini benar

// --- Panggil CSS khusus untuk halaman ini ---
import '../css/Shop.css';

const Shop = () => {
  return (
    // --- Komponen hanya berisi konten utamanya saja, tanpa Navbar dan Footer ---
    <main className="shop-container">
      {/* Header di bawah Navbar seperti di video */}
      <header className="shop-header">
        <div className="shop-filters">
          <a href="#" className="filter-link active">All Products</a>
          <a href="#" className="filter-link">Women</a>
          <a href="#" className="filter-link">Men</a>
        </div>
        <button className="design-button">Design Your T-Shirt</button>
      </header>

      {/* Tampilkan semua produk menggunakan .map */}
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default Shop;