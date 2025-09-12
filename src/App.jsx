// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Impor semua komponen dan halaman yang dibutuhkan
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail'; // --- 1. TAMBAHKAN impor halaman ProductDetail ---

import './index.css';

function App() {
  return (
    <Router>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* --- 2. TAMBAHKAN rute baru untuk halaman detail produk --- */}
          {/* :productId adalah parameter dinamis */}
          <Route path="/product/:productId" element={<ProductDetail />} />

        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;