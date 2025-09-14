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

      const planeZ = shirtSide === 'front' ? 0.1 : -0.1; // Gunakan nilai Z tetap untuk intersection
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, shirtSide === 'front' ? 1 : -1), -planeZ);
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

// Model T-shirt yang menampilkan logo yang sesuai
function TshirtModel({
  shirtColor,
  logoDetails, // Menerima semua detail logo
  onLogoPositionChange,
  onLogoRotationChange,
  isDragging,
  onDragStart,
  onDragEnd,
}) {
  const meshRef = useRef();
  const gltf = useGLTF('/t_shirt.glb');

  const clonedScene = React.useMemo(() => {
    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.color = new THREE.Color(shirtColor);
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [gltf.scene, shirtColor]);

  if (!clonedScene) {
    return null;
  }

  return (
    <group ref={meshRef} scale={[2.5, 2.5, 2.5]} position={[0, -2.5, 0]}>
      <primitive object={clonedScene} />

      {/* Render Logo Depan */}
      {logoDetails.front.texture && (
        <DraggableLogo
          logoTexture={logoDetails.front.texture}
          logoSize={logoDetails.front.size}
          logoPosition={logoDetails.front.position}
          logoRotation={logoDetails.front.rotation}
          onPositionChange={(pos) => onLogoPositionChange('front', pos)}
          onRotationChange={(rot) => onLogoRotationChange('front', rot)}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          shirtSide='front'
        />
      )}

      {/* Render Logo Belakang */}
      {logoDetails.back.texture && (
        <DraggableLogo
          logoTexture={logoDetails.back.texture}
          logoSize={logoDetails.back.size}
          logoPosition={logoDetails.back.position}
          logoRotation={logoDetails.back.rotation}
          onPositionChange={(pos) => onLogoPositionChange('back', pos)}
          onRotationChange={(rot) => onLogoRotationChange('back', rot)}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          shirtSide='back'
        />
      )}
    </group>
  );
}

// Fallback T-shirt dengan logika yang sama
function FallbackTshirt({
  shirtColor,
  logoDetails,
  onLogoPositionChange,
  onLogoRotationChange,
  isDragging,
  onDragStart,
  onDragEnd,
}) {
  const meshRef = useRef();

  return (
    <group ref={meshRef} scale={[1.8, 1.8, 1.8]} position={[0, -1.5, 0]}>
      {/* T-shirt body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2, 2.5, 0.2]} />
        <meshStandardMaterial color={shirtColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Sleeves, etc. */}
      <mesh position={[-1.3, 0.7, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color={shirtColor} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.3, 0.7, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color={shirtColor} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.3, 0.05]}>
        <torusGeometry args={[0.3, 0.1, 8, 16]} />
        <meshStandardMaterial color={shirtColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Render Logo Depan */}
      {logoDetails.front.texture && (
        <DraggableLogo
          logoTexture={logoDetails.front.texture}
          logoSize={logoDetails.front.size}
          logoPosition={logoDetails.front.position}
          logoRotation={logoDetails.front.rotation}
          onPositionChange={(pos) => onLogoPositionChange('front', pos)}
          onRotationChange={(rot) => onLogoRotationChange('front', rot)}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          shirtSide='front'
        />
      )}

      {/* Render Logo Belakang */}
      {logoDetails.back.texture && (
        <DraggableLogo
          logoTexture={logoDetails.back.texture}
          logoSize={logoDetails.back.size}
          logoPosition={logoDetails.back.position}
          logoRotation={logoDetails.back.rotation}
          onPositionChange={(pos) => onLogoPositionChange('back', pos)}
          onRotationChange={(rot) => onLogoRotationChange('back', rot)}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          shirtSide='back'
        />
      )}

      <Html position={[0, -2, 0]} center>
        <div style={{
          color: 'white', fontSize: '12px', background: 'rgba(0,0,0,0.5)',
          padding: '4px 8px', borderRadius: '4px'
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
          width: '48px', height: '48px', border: '4px solid white',
          borderTop: '4px solid transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite', margin: '0 auto 16px'
        }}></div>
        <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Loading 3D T-shirt Model...</p>
        <p style={{ fontSize: '14px', opacity: '0.75', margin: '0' }}>Mencoba load t_shirt.glb...</p>
      </div>
    </Html>
  );
}

const Design = () => {
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [shirtSide, setShirtSide] = useState('front'); // 'front' or 'back'

  const initialLogoState = {
    dataUrl: null,
    texture: null,
    size: 0.4,
    position: { x: 0, y: 0.8, z: 0.1 },
    rotation: 0,
  };

  const [logoDetails, setLogoDetails] = useState({
    front: { ...initialLogoState },
    back: { ...initialLogoState },
  });

  const [isRotating, setIsRotating] = useState(true);
  const [modelError, setModelError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();
  const orbitControlsRef = useRef();
  const canvasRef = useRef();

  // --- START: Blok kode untuk responsivitas ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    // Cleanup listener saat komponen dibongkar
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // --- END: Blok kode untuk responsivitas ---


  const colors = [
    '#ffffff', '#f2f2f2', '#808080', '#000000', '#ffc0cb', '#ff0000',
    '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'
  ];

  const handleLogoUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(e.target.result, (texture) => {
          texture.anisotropy = 16;
          setLogoDetails(prev => ({
            ...prev,
            [shirtSide]: {
              ...prev[shirtSide],
              dataUrl: e.target.result,
              texture: texture,
            }
          }));
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    setShirtColor('#ffffff');
    setLogoDetails({
      front: { ...initialLogoState },
      back: { ...initialLogoState },
    });
    setShirtSide('front');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogoDelete = () => {
    setLogoDetails(prev => ({
      ...prev,
      [shirtSide]: { ...initialLogoState }
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;

    try {
      const wasRotating = isRotating;
      setIsRotating(false);
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(canvasRef.current, {
        backgroundColor: '#667eea', quality: 0.95, pixelRatio: 2
      });

      const link = document.createElement('a');
      link.download = 'desain-kaos.png';
      link.href = dataUrl;
      link.click();

      if (wasRotating) {
        setIsRotating(true);
      }

    } catch (error) {
      console.error('Error saving image:', error);
      alert('Gagal menyimpan gambar. Silakan coba lagi.');
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setIsRotating(false);
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
  };

  const handleLogoPositionChange = (side, newPosition) => {
    setLogoDetails(prev => ({
      ...prev,
      [side]: { ...prev[side], position: newPosition }
    }));
  };

  const handleLogoRotationChange = (side, newRotation) => {
    setLogoDetails(prev => ({
      ...prev,
      [side]: { ...prev[side], rotation: newRotation }
    }));
  };

  const handleLogoSizeChange = (newSize) => {
    setLogoDetails(prev => ({
      ...prev,
      [shirtSide]: { ...prev[shirtSide], size: newSize }
    }));
  };

  const toggleShirtSide = () => {
    setShirtSide(shirtSide === 'front' ? 'back' : 'front');
  };

  useEffect(() => {
    fetch('/t_shirt.glb')
      .then(response => {
        if (!response.ok) {
          setModelError(true);
        } else {
          setModelError(false);
        }
      })
      .catch(() => setModelError(true));
  }, []);

  const activeLogo = logoDetails[shirtSide];

  return (
    <div style={{
      display: 'flex',
      // Mengubah arah flexbox untuk mobile
      flexDirection: isMobile ? 'column' : 'row',
      fontFamily: 'Poppins, sans-serif',
      height: '100vh',
      backgroundColor: '#f4f4f9',
      // Mengizinkan scroll di mobile jika konten melebihi layar
      overflow: isMobile ? 'auto' : 'hidden'
    }}>
      {/* Control Panel */}
      <div style={{
        // Mengubah lebar dan tinggi untuk mobile
        width: isMobile ? '100%' : '380px',
        height: isMobile ? 'auto' : '100vh',
        backgroundColor: '#ffffff',
        padding: isMobile ? '16px' : '24px',
        // Mengubah border untuk mobile
        borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
        borderBottom: isMobile ? '1px solid #e0e0e0' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: isMobile ? '0 2px 10px rgba(0,0,0,0.1)' : '2px 0 15px rgba(0, 0, 0, 0.05)',
        overflowY: 'auto',
        flexShrink: 0 // Mencegah panel menyusut
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
          backgroundColor: '#6c63ff', color: 'white', borderRadius: '12px'
        }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', fontWeight: 'bold' }}>👕</span>
          <div>
            <h1 style={{ margin: '0', fontSize: '1.4rem', fontWeight: '600' }}>
              T-shirt Designer 3D
            </h1>
            <p style={{ margin: '0', fontSize: '0.8rem', fontWeight: '300', opacity: '0.9' }}>
              REAL 3D T-SHIRT DESIGNER
            </p>
          </div>
        </div>

        {/* Status */}
        <div style={{
          padding: '12px', backgroundColor: modelError ? '#fff3cd' : '#d4edda',
          borderRadius: '8px', fontSize: '0.9rem', color: modelError ? '#856404' : '#155724',
          border: `1px solid ${modelError ? '#ffeaa7' : '#c3e6cb'}`
        }}>
          {modelError
            ? '⚠️ Menggunakan model T-shirt fallback (t_shirt.glb tidak ditemukan)'
            : '✅ Model 3D T-shirt berhasil dimuat'}
        </div>

        {/* Sisi Kaos */}
        <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#333' }}>
            Sisi Kaos
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setShirtSide('front')} style={{
              flex: '1', padding: '12px',
              backgroundColor: shirtSide === 'front' ? '#6c63ff' : '#f8f9fa',
              color: shirtSide === 'front' ? 'white' : '#333',
              border: `1px solid ${shirtSide === 'front' ? '#6c63ff' : '#ddd'}`,
              borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease'
            }}>
              Depan
            </button>
            <button onClick={() => setShirtSide('back')} style={{
              flex: '1', padding: '12px',
              backgroundColor: shirtSide === 'back' ? '#6c63ff' : '#f8f9fa',
              color: shirtSide === 'back' ? 'white' : '#333',
              border: `1px solid ${shirtSide === 'back' ? '#6c63ff' : '#ddd'}`,
              borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease'
            }}>
              Belakang
            </button>
          </div>
        </div>

        {/* Color Picker */}
        <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#333' }}>
            Pilih Warna Kaos
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {colors.map((color) => (
              <button key={color} onClick={() => setShirtColor(color)} style={{
                  width: '32px', height: '32px', backgroundColor: color, border: 'none',
                  borderRadius: '50%', cursor: 'pointer',
                  boxShadow: shirtColor === color ? `0 0 0 3px #6c63ff, 0 0 0 5px ${color}` : '0 2px 4px rgba(0,0,0,0.1)'
                }} title={color} />
            ))}
          </div>
        </div>

        {/* Logo Upload */}
        <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#333' }}>
            Unggah Logo (Sisi {shirtSide === 'front' ? 'Depan' : 'Belakang'})
          </h3>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />

          {!activeLogo.dataUrl ? (
            <div onClick={() => fileInputRef.current?.click()} style={{
                padding: '24px', border: '2px dashed #6c63ff', borderRadius: '8px',
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                <img src={activeLogo.dataUrl} alt="Logo" style={{
                    maxWidth: '100%', maxHeight: '120px', borderRadius: '8px', border: '1px solid #ddd'
                  }} />
                <button onClick={handleLogoDelete} style={{
                    position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px',
                    borderRadius: '50%', backgroundColor: '#ff4757', color: 'white', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                  }}>
                  ✕
                </button>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#555' }}>
                Logo sisi {shirtSide === 'front' ? 'depan' : 'belakang'} berhasil diunggah
              </p>
            </div>
          )}
        </div>

        {/* Logo Controls */}
        {activeLogo.dataUrl && (
          <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#333' }}>
              Kontrol Logo
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Ukuran Logo
              </label>
              <input type="range" min="0.1" max="0.8" step="0.01" value={activeLogo.size}
                onChange={(e) => handleLogoSizeChange(parseFloat(e.target.value))}
                style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Rotasi Logo
              </label>
              <input type="range" min={-Math.PI} max={Math.PI} step="0.01" value={activeLogo.rotation}
                onChange={(e) => handleLogoRotationChange(shirtSide, parseFloat(e.target.value))}
                style={{ width: '100%' }} />
            </div>
            <div style={{ padding: '12px', backgroundColor: '#e7f3ff', borderRadius: '8px', fontSize: '0.85rem', color: '#0066cc' }}>
              <strong>Tips:</strong> Drag logo untuk memindahkan, tekan Shift + drag untuk memutar
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px' }}>
          <button onClick={resetAll} style={{
              flex: '1', padding: '12px', backgroundColor: '#f8f9fa', color: '#333',
              border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
            }}>
            Reset
          </button>
          <button onClick={handleSave} style={{
              flex: '1', padding: '12px', backgroundColor: '#6c63ff', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
            }}>
            💾 Download PNG
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{
        flex: 1,
        position: 'relative',
        // Memberi tinggi minimal untuk canvas di mobile
        minHeight: isMobile ? '50vh' : 'auto'
      }}>
        <div ref={canvasRef} style={{ width: '100%', height: '100%', minHeight: '300px' }}>
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }} style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '100%', height: '100%'
            }}>
            <Suspense fallback={<LoadingFallback />}>
              <Environment />
              <OrbitControls ref={orbitControlsRef} enablePan={true} enableZoom={true} enableRotate={!isDragging}
                minPolarAngle={Math.PI / 4} maxPolarAngle={3 * Math.PI / 4}
                minDistance={3} maxDistance={8} />

              {modelError ? (
                <FallbackTshirt shirtColor={shirtColor} logoDetails={logoDetails}
                  onLogoPositionChange={handleLogoPositionChange} onLogoRotationChange={handleLogoRotationChange}
                  isDragging={isDragging} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
              ) : (
                <TshirtModel shirtColor={shirtColor} logoDetails={logoDetails}
                  onLogoPositionChange={handleLogoPositionChange} onLogoRotationChange={handleLogoRotationChange}
                  isDragging={isDragging} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
              )}
            </Suspense>
          </Canvas>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: isMobile ? '8px 12px' : '12px 20px', // Padding lebih kecil di mobile
          borderRadius: '8px',
          fontSize: isMobile ? '0.8rem' : '0.9rem', // Font lebih kecil di mobile
          textAlign: 'center',
          backdropFilter: 'blur(4px)',
          width: 'max-content'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>🖱️</span>
            <span><b>L-Click</b>: Putar, <b>R-Click</b>: Geser, <b>Scroll</b>: Zoom</span>
          </div>
        </div>

        <button onClick={toggleShirtSide} style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: isMobile ? '8px 12px' : '10px 16px', // Padding lebih kecil di mobile
          fontSize: isMobile ? '0.8rem' : 'inherit', // Font lebih kecil di mobile
          backgroundColor: 'rgba(108, 99, 255, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          backdropFilter: 'blur(4px)',
          zIndex: 10
        }}>
          {shirtSide === 'front' ? 'Atur Sisi Belakang 🔄' : '🔄 Atur Sisi Depan'}
        </button>
      </div>
    </div>
  );
};

export default Design;

