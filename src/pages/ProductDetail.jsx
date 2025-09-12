import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext'; // --- 1. TAMBAHAN: Impor useCart ---
import '../css/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find(p => p.id === parseInt(productId));

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('WHITE');
  
  // --- 2. TAMBAHAN: State untuk pop-up dan akses ke fungsi addToCart ---
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);

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
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  // --- 3. TAMBAHAN: Fungsi untuk handle klik "Add to Cart" ---
  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      size: selectedSize,
      color: selectedColor,
    };
    addToCart(productToAdd);
    setShowPopup(true);
    // Sembunyikan pop-up setelah 3 detik
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <> {/* Gunakan Fragment untuk membungkus halaman dan pop-up */}
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
            <div className="option-group">
              <label htmlFor="size">Size</label>
              <div className="size-selector">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="option-group">
              <label htmlFor="color">Color</label>
              <div className="color-selector">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* --- 4. MODIFIKASI: Panggil handleAddToCart saat tombol diklik --- */}
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>
      </main>

      {/* --- 5. TAMBAHAN: JSX untuk Pop-up --- */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
            <div className="popup-icon">🛒</div>
            <p>T-Shirt Berhasil Ditambahkan ke Keranjang</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;