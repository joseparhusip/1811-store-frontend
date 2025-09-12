// src/components/shop/ProductCard.jsx

import React from 'react';
// --- 1. Impor 'Link' dari react-router-dom ---
import { Link } from 'react-router-dom';

// Fungsi untuk memformat harga
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

// Komponen menerima satu prop yaitu 'product'
const ProductCard = ({ product }) => {
  return (
    // --- 2. Bungkus seluruh kartu dengan komponen Link ---
    // Arahkan link ke halaman detail produk sesuai dengan ID produk
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        {/* Gunakan product.image sesuai dengan struktur data */}
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{formatPrice(product.price)}</p>
          </div>
          <button className="add-to-cart-btn">🛒</button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;