// src/pages/Shop.jsx

import React, { useState } from 'react';
import ProductCard from '../components/shop/ProductCard';
import { products } from '../data/products';
import '../css/Shop.css';

const Shop = () => {
  // State untuk filter dan produk yang ditampilkan
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Fungsi untuk menangani perubahan filter
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.category.toLowerCase() === filter.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <main className="shop-container">
      {/* Header dengan filter */}
      <header className="shop-header">
        <div className="shop-filters">
          <button 
            onClick={() => handleFilterChange('all')} 
            className={`filter-link ${activeFilter === 'all' ? 'active' : ''}`}
          >
            All Products ({products.length})
          </button>
          <button 
            onClick={() => handleFilterChange('women')} 
            className={`filter-link ${activeFilter === 'women' ? 'active' : ''}`}
          >
            Women ({products.filter(p => p.category === 'Women').length})
          </button>
          <button 
            onClick={() => handleFilterChange('men')} 
            className={`filter-link ${activeFilter === 'men' ? 'active' : ''}`}
          >
            Men ({products.filter(p => p.category === 'Men').length})
          </button>
        </div>
        <button className="design-button">Design Your T-Shirt</button>
      </header>

      {/* Tampilkan jumlah produk yang ditemukan */}
      <div className="results-info">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
        {activeFilter !== 'all' && (
          <p className="filter-info">Filtered by: <strong>{activeFilter}</strong></p>
        )}
      </div>

      {/* Grid produk */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try selecting a different category or check back later.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;