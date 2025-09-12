// src/pages/ProductDetail.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products'; // Pastikan path ini benar
import '../css/ProductDetail.css';

const ProductDetail = () => {
  // Mengambil productId dari URL
  const { productId } = useParams();
  
  // Mencari produk berdasarkan ID
  // Ingat: useParams mengembalikan string, jadi kita perlu konversi ke angka
  const product = products.find(p => p.id === parseInt(productId));

  // Jika produk tidak ditemukan, tampilkan pesan
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produk tidak ditemukan!</h2>
        <p>Silakan kembali ke halaman <Link to="/shop">Shop</Link>.</p>
      </div>
    );
  }

  return (
    <main className="product-detail-container">
      <div className="product-image-section">
        <img src={product.img} alt={product.name} className="main-product-image" />
      </div>
      <div className="product-info-section">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">{product.price}</p>
        <p className="product-description">
          T-shirt 1811 yang memiliki bahan baju yang lembut dan nyaman untuk dipakai kemana saja.
        </p>

        <div className="product-options">
          <div className="option-group">
            <label htmlFor="size">Size</label>
            <div className="size-selector">
              <button className="size-btn">S</button>
              <button className="size-btn active">M</button>
              <button className="size-btn">L</button>
              <button className="size-btn">XL</button>
            </div>
          </div>
          <div className="option-group">
            <label htmlFor="color">Color</label>
            <div className="color-selector">
              <button className="color-btn">BLACK</button>
              <button className="color-btn active">WHITE</button>
            </div>
          </div>
        </div>
        
        <button className="add-to-cart-button">ADD TO CART</button>
      </div>
    </main>
  );
};

export default ProductDetail;