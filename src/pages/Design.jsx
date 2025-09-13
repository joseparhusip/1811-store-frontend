// src/pages/Design.jsx

import React, { useState, Suspense, useEffect } from 'react'; // <-- MODIFIKASI
import '../css/Design.css';
import TshirtCanvas from '../components/common/TshirtCanvas';
import ErrorBoundary from '../components/common/ErrorBoundary';
import LoadingSpinner from '../components/common/LoadingSpinner'; // <-- BARU

const Design = () => {
  // --- BARU: State dan Effect untuk loading ---
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // Butuh waktu lebih untuk kanvas
    return () => clearTimeout(timer);
  }, []);
  // ------------------------------------------
  
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [logo, setLogo] = useState(null);
  const fileInputRef = React.useRef(null);

  const colors = [
    '#ffffff', '#f2f2f2', '#808080', '#000000', '#ffc0cb', '#ff0000',
    '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'
  ];

  const handleLogoUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(URL.createObjectURL(event.target.files[0]));
    }
  };

  const resetAll = () => {
    setShirtColor('#ffffff');
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();
  const handleLogoDelete = () => {
      setLogo(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSave = () => alert("Fitur 'Simpan Gambar' belum diimplementasikan untuk 3D.");

  // --- BARU: Render loading spinner ---
  if (isLoading) {
    return <LoadingSpinner />;
  }
  // ---------------------------------

  return (
    <div className="design-container">
      <div className="control-panel">
        <div className="panel-header">
          <span className="s-icon">S</span>
          <div>
            <h1 className="panel-title">T-shirt Designer 1811</h1>
            <p className="panel-subtitle">GOOD CLOTHES MADE FROM GOOD HAND</p>
          </div>
        </div>
        <div className="control-box">
          <p className="box-title">🎨 Warna T-Shirt</p>
          <div className="color-palette">
            {colors.map((color) => (
              <div
                key={color}
                className="color-swatch"
                style={{ backgroundColor: color }}
                onClick={() => setShirtColor(color)}
              />
            ))}
          </div>
        </div>
        <div className="control-box">
          <p className="box-title">🖼️ Upload Logo</p>
          <input
            type="file"
            accept="image/png, image/jpeg"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            style={{ display: 'none' }}
          />
          <button className="btn-control" onClick={triggerFileInput}>Pilih Gambar/Logo</button>
          <button className="btn-control btn-delete" onClick={handleLogoDelete}>HAPUS LOGO</button>
        </div>
        <p style={{textAlign: 'center', color: '#888', fontStyle: 'italic'}}>
            Gunakan mouse untuk memutar kaos di area kanvas.
        </p>
        <button className="btn-save" onClick={handleSave}>SIMPAN GAMBAR</button>
        <button className="btn-reset" onClick={resetAll}>RESET SEMUA</button>
      </div>

      <div className="tshirt-canvas-area">
        <ErrorBoundary>
          <Suspense fallback={<div className="canvas-fallback">Memuat Model 3D...</div>}>
            <TshirtCanvas 
              shirtColor={shirtColor}
              logoUrl={logo}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Design;