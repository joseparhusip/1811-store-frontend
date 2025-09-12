// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext.jsx'; 

// Impor Komponen & Halaman
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import './index.css';

// Komponen helper untuk menentukan layout (TIDAK ADA PERUBAHAN DI SINI)
const AppLayout = () => {
  const location = useLocation();
  const noLayoutPages = ['/login', '/signup'];
  const showLayout = !noLayoutPages.includes(location.pathname);

  return (
    <>
      {showLayout && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      {showLayout && <Footer />}
    </>
  );
};

// BAGIAN YANG DIPERBAIKI ADA DI SINI
function App() {
  return (
    // 1. Pindahkan <Router> menjadi pembungkus paling luar
    <Router>
      {/* 2. Letakkan Provider di DALAM <Router> */}
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;