// src/components/common/AdPopup.jsx

import React from 'react';
import '../../css/AdPopup.css';
import adImage from '../../assets/iklan/iklan.png';

const AdPopup = ({ isVisible, onClose }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* Tombol 'X' untuk menutup */}
        <button className="popup-close-btn" onClick={onClose}>
          &times;
        </button>
        
        {/* Gambar Iklan */}
        <a href="/shop" rel="noopener noreferrer">
            <img 
              src={adImage} 
              alt="Special Promotion" 
              className="popup-image" 
            />
        </a>
      </div>
    </div>
  );
};

export default AdPopup;