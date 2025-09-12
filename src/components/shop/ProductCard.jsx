// src/components/shop/ProductCard.jsx

import React from 'react';

const ProductCard = ({ product }) => {
  // Fungsi untuk format harga ke Rupiah tetap digunakan (ini sudah bagus!)
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number).replace('IDR', 'Rp');
  };

  return (
    // Class .product-card akan mengambil style dari Shop.css yang sudah kita samakan
    <div className="product-card">
      {/* STRUKTUR DIUBAH MENYAMAI HOME: Menghapus .product-image-container */}
      <img src={product.image} alt={product.name} className="product-image" />

      {/* STRUKTUR DIUBAH MENYAMAI HOME: Menggunakan .product-info sebagai flex container */}
      <div className="product-info">
        {/* Div pembungkus untuk nama dan harga */}
        <div>
          <h3 className="product-name">{product.name}</h3>
          {/* Pastikan harga yang diterima adalah angka, bukan string */}
          <p className="product-price">{formatRupiah(product.price)}</p>
        </div>
        
        {/* STRUKTUR DIUBAH MENYAMAI HOME: Mengganti div icon menjadi button */}
        <button className="add-to-cart-btn">🛒</button>
      </div>
    </div>
  );
};

export default ProductCard;