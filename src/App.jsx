import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- 1. TAMBAHAN: Impor CartProvider dan halaman Cart ---
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart'; 

// Impor komponen dan halaman lainnya
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';

import './index.css';

function App() {
  return (
    // --- 2. MODIFIKASI: Bungkus Router dengan CartProvider ---
    <CartProvider>
      <Router>
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            
            {/* --- 3. TAMBAHAN: Rute baru untuk halaman keranjang --- */}
            <Route path="/cart" element={<Cart />} />
            
          </Routes>
        </main>

        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;