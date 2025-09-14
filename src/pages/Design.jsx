import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { toPng } from 'html-to-image';

// Error Boundary untuk menangkap error loading
function ErrorFallback({ error }) {
  return (
    <Html center>
      <div style={{
        textAlign: 'center',
        padding: '24px',
        background: '#fee',
        borderRadius: '12px',
        color: '#d32f2f',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>⚠ Model Loading Error</h2>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>File t_shirt.glb tidak ditemukan</p>
        <p style={{ margin: '0', fontSize: '12px', opacity: '0.7' }}>
          Pastikan file t_shirt.glb ada di folder public/
        </p>
      </div>
    </Html>
  );
}

// Komponen Logo yang bisa didrag
function DraggableLogo({ 
  logoTexture, 
  logoSize, 
  logoPosition, 
  logoRotation,
  onPositionChange, 
  onRotationChange,
  isDragging, 
  onDragStart, 
  onDragEnd,
  shirtSide // 'front' or 'back'
}) {
  const logoRef = useRef();
  const { camera, gl, raycaster } = useThree();
  const [dragStart, setDragStart] = useState(null);
  const [rotateMode, setRotateMode] = useState(false);
  
  const handlePointerDown = (event) => {
    event.stopPropagation();
    
    // Mode rotasi dengan menekan tombol Shift
    if (event.shiftKey) {
      setRotateMode(true);
      const rect = gl.domElement.getBoundingClientRect();
      setDragStart({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        initialRotation: logoRotation
      });
    } else {
      // Mode translasi (normal)
      setRotateMode(false);
      onDragStart();
    }
    
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    if (rotateMode) {
      setRotateMode(false);
      setDragStart(null);
    } else {
      onDragEnd();
    }
    gl.domElement.style.cursor = 'grab';
  };

  const handlePointerMove = (event) => {
    if (!isDragging && !rotateMode) return;
    
    event.stopPropagation();
    
    const rect = gl.domElement.getBoundingClientRect();
    
    if (rotateMode && dragStart) {
      // Mode rotasi logo
      const deltaX = ((event.clientX - rect.left) - dragStart.x) / rect.width;
      const newRotation = dragStart.initialRotation + deltaX * Math.PI;
      onRotationChange(newRotation);
    } else if (isDragging) {
      // Mode translasi logo
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      // Buat plane di posisi Z yang sama dengan logo untuk intersection
      const planeZ = shirtSide === 'front' ? logoPosition.z : -logoPosition.z;
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -planeZ);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection) {
        // Batasi pergerakan logo dalam area yang masuk akal
        const newX = Math.max(-1.2, Math.min(1.2, intersection.x));
        const newY = Math.max(-0.5, Math.min(1.5, intersection.y));
        
        onPositionChange({
          x: newX,
          y: newY,
          z: logoPosition.z
        });
      }
    }
  };

  useEffect(() => {
    if (isDragging || rotateMode) {
      const handleMouseMove = (e) => handlePointerMove(e);
      const handleMouseUp = () => handlePointerUp();
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, rotateMode, dragStart]);

  if (!logoTexture) return null;

  // Sesuaikan posisi Z berdasarkan sisi kaos (depan/belakang)
  const adjustedZ = shirtSide === 'front' ? logoPosition.z : -logoPosition.z;

  return (
    <mesh 
      ref={logoRef}
      position={[logoPosition.x, logoPosition.y, adjustedZ]}
      rotation={[0, 0, logoRotation]}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => !isDragging && (gl.domElement.style.cursor = 'grab')}
      onPointerLeave={() => !isDragging && (gl.domElement.style.cursor = 'default')}
    >
      <planeGeometry args={[logoSize, logoSize]} />
      <meshStandardMaterial 
        map={logoTexture} 
        transparent 
        alphaTest={0.1}
        depthTest={true}
        roughness={0.3}
        metalness={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// T-shirt Model dengan posisi yang diperbaiki (INI YANG DIPERBAIKI)
function TshirtModel({ 
  shirtColor, 
  logoTexture, 
  logoSize, 
  logoPosition, 
  logoRotation,
  onLogoPositionChange,
  onLogoRotationChange,
  isDragging,
  onDragStart,
  onDragEnd,
  shirtSide // 'front' or 'back'
}) {
  const meshRef = useRef();
  
  // Panggil useGLTF secara langsung, biarkan Suspense yang menangani loading
  const gltf = useGLTF('/t_shirt.glb');

  // Clone dan update material
  const clonedScene = React.useMemo(() => {
    if (!gltf.scene) return null;
    const cloned = gltf.scene.clone();
    
    cloned.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material = child.material.clone();
          child.material.color = new THREE.Color(shirtColor);
          child.material.needsUpdate = true;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return cloned;
  }, [gltf.scene, shirtColor]);

  if (!clonedScene) {
    return null; // Return null jika scene belum siap, Suspense akan handle
  }

  return (
    <group ref={meshRef} scale={[2.5, 2.5, 2.5]} position={[0, -2.5, 0]}>
      <primitive object={clonedScene} />
      
      {/* Logo yang bisa didrag */}
      <DraggableLogo
        logoTexture={logoTexture}
        logoSize={logoSize}
        logoPosition={logoPosition}
        logoRotation={logoRotation}
        onPositionChange={onLogoPositionChange}
        onRotationChange={onLogoRotationChange}
        isDragging={isDragging}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        shirtSide={shirtSide}
      />
    </group>
  );
}

// Fallback T-shirt dengan posisi yang konsisten
function FallbackTshirt({ 
  shirtColor, 
  logoTexture, 
  logoSize, 
  logoPosition, 
  logoRotation,
  onLogoPositionChange,
  onLogoRotationChange,
  isDragging,
  onDragStart,
  onDragEnd,
  shirtSide // 'front' or 'back'
}) {
  const meshRef = useRef();

  return (
    <group ref={meshRef} scale={[1.8, 1.8, 1.8]} position={[0, -1.5, 0]}>
      {/* T-shirt body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2, 2.5, 0.2]} />
        <meshStandardMaterial color={shirtColor} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Sleeves */}
      <mesh position={[-1.3, 0.7, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color={shirtColor} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.3, 0.7, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color={shirtColor} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 1.3, 0.05]}>
        <torusGeometry args={[0.3, 0.1, 8, 16]} />
        <meshStandardMaterial color={shirtColor} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Logo yang bisa didrag */}
      <DraggableLogo
        logoTexture={logoTexture}
        logoSize={logoSize}
        logoPosition={logoPosition}
        logoRotation={logoRotation}
        onPositionChange={onLogoPositionChange}
        onRotationChange={onLogoRotationChange}
        isDragging={isDragging}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        shirtSide={shirtSide}
      />
      
      {/* Label */}
      <Html position={[0, -2, 0]} center>
        <div style={{
          color: 'white',
          fontSize: '12px',
          background: 'rgba(0,0,0,0.5)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          Fallback T-shirt (Model 3D tidak tersedia)
        </div>
      </Html>
    </group>
  );
}

// Environment
function Environment() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </>
  );
}

// Loading Component
function LoadingFallback() {
  return (
    <Html center>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid white',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Loading 3D T-shirt Model...</p>
        <p style={{ fontSize: '14px', opacity: '0.75', margin: '0' }}>Mencoba load t_shirt.glb...</p>
      </div>
    </Html>
  );
}

const Design = () => {
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [logoTexture, setLogoTexture] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(0.4); // Ukuran lebih kecil
  
  // Posisi logo lebih dekat ke permukaan kaos
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0.8, z: 0.1 });
  const [logoRotation, setLogoRotation] = useState(0); // Rotasi logo
  const [shirtSide, setShirtSide] = useState('front'); // 'front' or 'back'
  
  const [isRotating, setIsRotating] = useState(true);
  const [modelError, setModelError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();
  const orbitControlsRef = useRef();
  const canvasRef = useRef();

  const colors = [
    '#ffffff', '#f2f2f2', '#808080', '#000000', '#ffc0cb', '#ff0000',
    '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'
  ];

  const handleLogoUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(e.target.result, (texture) => {
            texture.anisotropy = 16;
            setLogoTexture(texture);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    setShirtColor('#ffffff');
    setLogo(null);
    setLogoTexture(null);
    setLogoSize(0.4);
    setLogoPosition({ x: 0, y: 0.8, z: 0.1 });
    setLogoRotation(0);
    setShirtSide('front');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogoDelete = () => {
    setLogo(null);
    setLogoTexture(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;
    
    try {
      // Menonaktifkan kontrol selama screenshot
      const wasRotating = isRotating;
      setIsRotating(false);
      
      // Tunggu sebentar untuk memastikan render selesai
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Konversi canvas ke gambar PNG
      const dataUrl = await toPng(canvasRef.current, {
        backgroundColor: '#667eea',
        quality: 0.95,
        pixelRatio: 2 // Kualitas lebih tinggi
      });
      
      // Buat link download
      const link = document.createElement('a');
      link.download = 'desain-kaos.png';
      link.href = dataUrl;
      link.click();
      
      // Kembalikan state rotasi jika sebelumnya aktif
      if (wasRotating) {
        setIsRotating(true);
      }
      
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Gagal menyimpan gambar. Silakan coba lagi.');
    }
  };

  // Handle drag logo
  const handleDragStart = () => {
    setIsDragging(true);
    setIsRotating(false);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true;
    }
  };

  const handleLogoPositionChange = (newPosition) => {
    setLogoPosition(newPosition);
  };

  const handleLogoRotationChange = (newRotation) => {
    setLogoRotation(newRotation);
  };

  const toggleShirtSide = () => {
    setShirtSide(shirtSide === 'front' ? 'back' : 'front');
  };

  useEffect(() => {
    // Cek apakah file model ada, jika tidak, set modelError ke true
    fetch('/t_shirt.glb')
      .then(response => {
        if (!response.ok) {
          console.warn('⚠️ t_shirt.glb tidak ditemukan, menggunakan fallback');
          setModelError(true);
        } else {
          console.log('✅ t_shirt.glb ditemukan');
          setModelError(false);
        }
      })
      .catch(() => {
        console.warn('⚠️ Error checking t_shirt.glb, menggunakan fallback');
        setModelError(true);
      });
  }, []);

  return (
    <div style={{
      display: 'flex',
      fontFamily: 'Poppins, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f4f4f9'
    }}>
      {/* Control Panel */}
      <div style={{
        width: '380px',
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '2px 0 15px rgba(0, 0, 0, 0.05)',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          backgroundColor: '#6c63ff',
          color: 'white',
          borderRadius: '12px'
        }}>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '3rem',
            fontWeight: 'bold'
          }}>👕</span>
          <div>
            <h1 style={{ margin: '0', fontSize: '1.4rem', fontWeight: '600' }}>
              T-shirt Designer 3D
            </h1>
            <p style={{ 
              margin: '0', 
              fontSize: '0.8rem', 
              fontWeight: '300', 
              opacity: '0.9' 
            }}>
              REAL 3D T-SHIRT DESIGNER
            </p>
          </div>
        </div>

        {/* Status */}
        <div style={{
          padding: '12px',
          backgroundColor: modelError ? '#fff3cd' : '#d4edda',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: modelError ? '#856404' : '#155724',
          border: `1px solid ${modelError ? '#ffeaa7' : '#c3e6cb'}`
        }}>
          {modelError 
            ? '⚠️ Menggunakan model T-shirt fallback (t_shirt.glb tidak ditemukan)' 
            : '✅ Model 3D T-shirt berhasil dimuat'}
        </div>

        {/* Sisi Kaos */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#333' }}>
            Sisi Kaos
          </h3>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={() => setShirtSide('front')}
              style={{
                flex: '1',
                padding: '12px',
                backgroundColor: shirtSide === 'front' ? '#6c63ff' : '#f8f9fa',
                color: shirtSide === 'front' ? 'white' : '#333',
                border: `1px solid ${shirtSide === 'front' ? '#6c63ff' : '#ddd'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Depan
            </button>
            <button
              onClick={() => setShirtSide('back')}
              style={{
                flex: '1',
                padding: '12px',
                backgroundColor: shirtSide === 'back' ? '#6c63ff' : '#f8f9fa',
                color: shirtSide === 'back' ? 'white' : '#333',
                border: `1px solid ${shirtSide === 'back' ? '#6c63ff' : '#ddd'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Belakang
            </button>
          </div>
        </div>

        {/* Color Picker */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#333' }}>
            Pilih Warna Kaos
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setShirtColor(color)}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: color,
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  boxShadow: shirtColor === color ? `0 0 0 3px #6c63ff, 0 0 0 5px ${color}` : '0 2px 4px rgba(0,0,0,0.1)'
                }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Logo Upload */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#333' }}>
            Unggah Logo
          </h3>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ display: 'none' }}
          />
          
          {!logo ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '24px',
                border: '2px dashed #6c63ff',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
              <p style={{ margin: '0', color: '#6c63ff', fontWeight: '500' }}>
                Klik untuk mengunggah logo
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#777' }}>
                Format: JPG, PNG, GIF
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '16px'
              }}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '120px',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
                <button
                  onClick={handleLogoDelete}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#ff4757',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}
                >
                  ✕
                </button>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#555' }}>
                Logo berhasil diunggah
              </p>
            </div>
          )}
        </div>

        {/* Logo Controls */}
        {logo && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#333' }}>
              Kontrol Logo
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Ukuran Logo
              </label>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.01"
                value={logoSize}
                onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                <span>Kecil</span>
                <span>Besar</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Rotasi Logo
              </label>
              <input
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step="0.01"
                value={logoRotation}
                onChange={(e) => setLogoRotation(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                <span>-180°</span>
                <span>0°</span>
                <span>180°</span>
              </div>
            </div>
            
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#e7f3ff', 
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#0066cc'
            }}>
              <strong>Tips:</strong> Drag logo untuk memindahkan, tekan Shift + drag untuk memutar
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: 'auto',
          paddingTop: '16px'
        }}>
          <button
            onClick={resetAll}
            style={{
              flex: '1',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: '1',
              padding: '12px',
              backgroundColor: '#6c63ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a52d5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c63ff'}
          >
            💾 Download PNG
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={canvasRef} style={{ width: '100%', height: '100%' }}>
          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '100%',
              height: '100%'
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <Environment />
              
              <OrbitControls
                ref={orbitControlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={isRotating}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={3 * Math.PI / 4}
                minDistance={3}
                maxDistance={8}
              />
              
              {modelError ? (
                <FallbackTshirt
                  shirtColor={shirtColor}
                  logoTexture={logoTexture}
                  logoSize={logoSize}
                  logoPosition={logoPosition}
                  logoRotation={logoRotation}
                  onLogoPositionChange={handleLogoPositionChange}
                  onLogoRotationChange={handleLogoRotationChange}
                  isDragging={isDragging}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  shirtSide={shirtSide}
                />
              ) : (
                <TshirtModel
                  shirtColor={shirtColor}
                  logoTexture={logoTexture}
                  logoSize={logoSize}
                  logoPosition={logoPosition}
                  logoRotation={logoRotation}
                  onLogoPositionChange={handleLogoPositionChange}
                  onLogoRotationChange={handleLogoRotationChange}
                  isDragging={isDragging}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  shirtSide={shirtSide}
                />
              )}
            </Suspense>
          </Canvas>
        </div>

        {/* Canvas Overlay Instructions */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          textAlign: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🖱️</span>
            <span>Drag untuk memutar, Scroll untuk zoom</span>
          </div>
        </div>

        {/* Toggle Sisi Kaos Button */}
        <button
          onClick={toggleShirtSide}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            padding: '10px 16px',
            backgroundColor: 'rgba(108, 99, 255, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            backdropFilter: 'blur(4px)',
            zIndex: 10
          }}
        >
          {shirtSide === 'front' ? 'Tampilkan Belakang 🔄' : '🔄 Tampilkan Depan'}
        </button>
      </div>
    </div>
  );
};

export default Design;