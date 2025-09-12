// src/pages/Checkout.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../css/Checkout.css'; 

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '', email: '', provinsi: '', kota: '', kecamatan: '',
    kodePos: '', alamat: '', catatan: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('bni');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const ongkosKirim = 25000;
  const biayaLain = 10000;
  const total = subtotal + ongkosKirim + biayaLain;

  // --- PERUBAHAN UTAMA DI FUNGSI INI ---
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
        alert("Keranjang Anda kosong!");
        navigate('/shop');
        return;
    }
    const orderDetails = {
      shippingInfo: formData,
      orderItems: cartItems,
      paymentMethod,
      totalPrice: total,
    };
    
    // Arahkan ke halaman pembayaran dengan membawa detail pesanan
    navigate('/payment', { state: { orderDetails } });
  };

  return (
    <div className="checkout-container">
      {/* ... sisa JSX tidak berubah ... */}
       <div className="checkout-header">
        <button onClick={() => navigate('/cart')} className="back-button">&#x2190;</button>
      </div>

      <form className="checkout-content" onSubmit={handlePlaceOrder}>
        <div className="shipping-details">
          <h3>DETAIL PESANAN</h3>
          <input type="text" name="nama" placeholder="Nama Lengkap" onChange={handleInputChange} required />
          <input type="text" name="email" placeholder="Email/Nomor telepon" onChange={handleInputChange} required />
          <input type="text" name="provinsi" placeholder="Provinsi" onChange={handleInputChange} required />
          <input type="text" name="kota" placeholder="Kota" onChange={handleInputChange} required />
          <input type="text" name="kecamatan" placeholder="Kecamatan" onChange={handleInputChange} required />
          <input type="text" name="kodePos" placeholder="Kode Pos" onChange={handleInputChange} required />
          <textarea name="alamat" placeholder="Alamat lengkap" onChange={handleInputChange} required />
          <input type="text" name="catatan" placeholder="Catatan (opsional)" onChange={handleInputChange} />
        </div>

        <div className="order-summary">
          <h3>DETAIL PESANAN</h3>
          {cartItems.map(item => (
            <div className="summary-product" key={`${item.id}-${item.size}-${item.color}`}>
              <img src={item.image} alt={item.name} className="product-image"/>
              <div className="product-info"><p>{item.name}</p><span>Size: {item.size}</span></div>
              <div className="product-quantity"><span>Qty: {item.quantity}</span></div>
            </div>
          ))}
          <div className="price-details">
            <div className="price-row"><span>Produk</span><span>{formatPrice(subtotal)}</span></div>
            <div className="price-row"><span>Ongkos kirim</span><span>{formatPrice(ongkosKirim)}</span></div>
            <div className="price-row"><span>Biaya Lain-lain</span><span>{formatPrice(biayaLain)}</span></div>
            <div className="price-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <div className="payment-method">
            <h4>Metode Pembayaran</h4>
            <div className="payment-option">
              <input type="radio" id="bni" name="payment" value="bni" checked={paymentMethod === 'bni'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <label htmlFor="bni">Virtual Account BNI</label>
            </div>
            <div className="payment-option">
              <input type="radio" id="bca" name="payment" value="bca" checked={paymentMethod === 'bca'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <label htmlFor="bca">Virtual Account BCA</label>
            </div>
            <div className="payment-option">
              <input type="radio" id="mandiri" name="payment" value="mandiri" checked={paymentMethod === 'mandiri'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <label htmlFor="mandiri">Virtual Account Mandiri</label>
            </div>
            <div className="payment-option">
              <input type="radio" id="bri" name="payment" value="bri" checked={paymentMethod === 'bri'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <label htmlFor="bri">Virtual Account BRI</label>
            </div>
          </div>
          <button type="submit" className="place-order-btn">PLACE ORDER</button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;