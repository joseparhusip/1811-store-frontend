// src/pages/ProductDetail.jsx

import React, { useState } from 'react'; // 1. Import useState
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products'; // Pastikan path ini benar
import '../css/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find(p => p.id === parseInt(productId));

  // 2. State untuk melacak ukuran dan warna yang aktif
  const [selectedSize, setSelectedSize] = useState('M'); // Default 'M' aktif
  const [selectedColor, setSelectedColor] = useState('WHITE'); // Default 'WHITE' aktif

  // --- Daftar Opsi (bisa juga dari data produk jika ada) ---
  const availableSizes = ['S', 'M', 'L', 'XL'];
  const availableColors = ['BLACK', 'WHITE'];


  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produk tidak ditemukan!</h2>
        <p>Silakan kembali ke halaman <Link to="/shop">Shop</Link>.</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <main className="product-detail-container">
      <div className="product-image-section">
        <img src={product.image} alt={product.name} className="main-product-image" />
      </div>
      <div className="product-info-section">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">{formatPrice(product.price)}</p>
        <p className="product-description">
          T-shirt 1811 yang memiliki bahan baju yang lembut dan nyaman untuk dipakai kemana saja.
        </p>

        <div className="product-options">
          {/* --- 3. Opsi Ukuran yang Interaktif --- */}
          <div className="option-group">
            <label htmlFor="size">Size</label>
            <div className="size-selector">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  // Cek apakah ukuran ini sama dengan yang ada di state
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  // Update state saat tombol di-klik
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* --- 4. Opsi Warna yang Interaktif --- */}
          <div className="option-group">
            <label htmlFor="color">Color</label>
            <div className="color-selector">
                {availableColors.map((color) => (
                    <button
                        key={color}
                        // Cek apakah warna ini sama dengan yang ada di state
                        className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                        // Update state saat tombol di-klik
                        onClick={() => setSelectedColor(color)}
                    >
                        {color}
                    </button>
                ))}
            </div>
          </div>
        </div>
        
        <button className="add-to-cart-button">ADD TO CART</button>
      </div>
    </main>
  );
};

export default ProductDetail;