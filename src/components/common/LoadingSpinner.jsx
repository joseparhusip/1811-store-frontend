// src/components/common/LoadingSpinner.jsx

import React from 'react';
import '../../css/LoadingSpinner.css'; // Import CSS baru kita

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      {/* Container untuk baris-baris animasi */}
      <div className="loader-bars">
        {/* Setiap div adalah satu baris animasi */}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;