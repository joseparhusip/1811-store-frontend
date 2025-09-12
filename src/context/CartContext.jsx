import React, { createContext, useState, useContext } from 'react';

// 1. Membuat Context
const CartContext = createContext();

// 2. Membuat Hook custom untuk mempermudah penggunaan context
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Membuat Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fungsi untuk menambah item ke keranjang
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Cek apakah produk dengan ID, ukuran, dan warna yang sama sudah ada
      const existingItem = prevItems.find(
        item => item.id === product.id && item.size === product.size && item.color === product.color
      );

      if (existingItem) {
        // Jika sudah ada, update kuantitasnya
        return prevItems.map(item =>
          item.id === product.id && item.size === product.size && item.color === product.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Jika belum ada, tambahkan sebagai item baru dengan kuantitas 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Fungsi untuk mengubah kuantitas item
  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      // Jika kuantitas 0 atau kurang, hapus item
      removeFromCart(productId, size, color);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId && item.size === size && item.color === color
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Fungsi untuk menghapus item dari keranjang
  const removeFromCart = (productId, size, color) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.id === productId && item.size === size && item.color === color)
      )
    );
  };

  // Nilai yang akan disediakan untuk komponen lain
  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};