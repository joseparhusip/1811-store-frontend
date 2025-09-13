// src/pages/Cart.jsx

import React, { useState, useEffect } from 'react'; // <-- MODIFIKASI
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../css/Cart.css';
import LoadingSpinner from '../components/common/LoadingSpinner'; // <-- BARU

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // --- BARU: State dan Effect untuk loading ---
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Loading lebih cepat
    return () => clearTimeout(timer);
  }, []);
  // ------------------------------------------

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // --- BARU: Render loading spinner ---
  if (isLoading) {
    return <LoadingSpinner />;
  }
  // ---------------------------------

  if (cartItems.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Your cart is empty.</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="start-shopping-btn">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-items-list">
        <div className="cart-header">
          <h4 className="header-product">PRODUCT</h4>
          <h4 className="header-size">SIZE</h4>
          <h4 className="header-quantity">QUANTITY</h4>
          <h4 className="header-total">TOTAL</h4>
        </div>

        {cartItems.map((item) => (
          <div className="cart-item" key={`${item.id}-${item.size}-${item.color}`}>
            <div className="item-product-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-info-wrapper">
              <div className="item-details">
                <p className="item-name">{item.name}</p>
                <button onClick={() => removeFromCart(item.id, item.size, item.color)} className="remove-btn">
                  Remove
                </button>
              </div>
              <div className="item-meta-row">
                <div className="item-size">
                  <span className="mobile-label">Size</span>
                  <span>{item.size}</span>
                </div>
                <div className="item-quantity">
                  <span className="mobile-label">Quantity</span>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
              <div className="item-total">
                <span className="mobile-label">Total</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>CART TOTAL</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row total-row">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Cart;