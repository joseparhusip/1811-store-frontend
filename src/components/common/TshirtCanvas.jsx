import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Error Boundary untuk menangkap error loading
function ErrorFallback({ error }) {
  return (
    <Html center>
      <div className="text-center p-6 bg-red-100 rounded-lg">
        <h2 className="text-red-600 font-bold mb-2">❌ Model Loading Error</h2>
        <p className="text-red-500 text-sm mb-4">File t_shirt.glb tidak ditemukan atau error</p>
        <p className="text-xs text-gray-600">Error: {error?.message || 'Unknown error'}</p>
        <div className="mt-4 text-xs text-gray-500">
          <p>Pastikan file t_shirt.glb ada di folder public/</p>
          <p>Path: public/t_shirt.glb</p>
        </div>
      </div>
    </Html>
  );
}

// T-shirt Model dengan error handling yang lebih baik
function TshirtModel({ shirtColor, logoTexture }) {
  const meshRef = useRef();
  const [loadError, setLoadError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  let gltf;
  try {
    gltf = useGLTF('/t_shirt.glb', true);
    useEffect(() => {
      if (gltf) {
        setIsLoaded(true);
        console.log('✅ GLTF Model loaded successfully:', gltf);
      }
    }, [gltf]);
  } catch (error) {
    console.error('❌ Error loading GLTF:', error);
    setLoadError(error);
    return <ErrorFallback error={error} />;
  }

  // Gentle rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  if (loadError) {
    return <ErrorFallback error={loadError} />;
  }

  if (!gltf || !gltf.scene) {
    return (
      <Html center>
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Loading 3D Model...</p>
        </div>
      </Html>
    );
  }

  // Clone dan update material
  const clonedScene = React.useMemo(() => {
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

  return (
    <group ref={meshRef} scale={[3, 3, 3]} position={[0, -1.5, 0]}>
      <primitive object={clonedScene} />
      
      {/* Logo overlay */}
      {logoTexture && (
        <mesh position={[0, 0.3, 0.1]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent 
            alphaTest={0.1}
          />
        </mesh>
      )}
    </group>
  );
}

// Fallback jika model tidak bisa load - buat T-shirt simple
function FallbackTshirt({ shirtColor, logoTexture }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={meshRef} scale={[2, 2, 2]} position={[0, 0, 0]}>
      {/* T-shirt body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.5, 0.2]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      
      {/* Sleeves */}
      <mesh position={[-1.3, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      <mesh position={[1.3, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 1.1, 0.05]}>
        <torusGeometry args={[0.3, 0.1, 8, 16]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      
      {/* Logo */}
      {logoTexture && (
        <mesh position={[0, 0.2, 0.11]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={logoTexture} transparent alphaTest={0.1} />
        </mesh>
      )}
      
      {/* Label */}
      <Html position={[0, -2, 0]} center>
        <div className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
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
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {/* Ground */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
    </>
  );
}

// Loading Component
function LoadingFallback() {
  return (
    <Html center>
      <div className="text-center text-white">
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">Loading 3D T-shirt Model...</p>
        <p className="text-sm opacity-75">Mencoba load t_shirt.glb...</p>
      </div>
    </Html>
  );
}

const TshirtDesigner3D = () => {
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [logoTexture, setLogoTexture] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const [modelError, setModelError] = useState(false);
  const fileInputRef = useRef();

  const colors = [
    '#ffffff', '#f8f8f8', '#e0e0e0', '#808080', '#000000', 
    '#ff4757', '#ff6b7d', '#ff9ff3', '#ffa502', '#ffdd59',
    '#26de81', '#2ed573', '#7bed9f', '#70a1ff', '#5352ed',
    '#3742fa', '#2f3542', '#57606f', '#a4b0be', '#747d8c'
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          setLogoTexture(texture);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    setShirtColor('#ffffff');
    setLogoTexture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if model file exists
  useEffect(() => {
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
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Control Panel */}
      <div className="w-80 bg-white p-6 shadow-xl flex flex-col gap-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold font-serif">👕</div>
            <div>
              <h1 className="text-xl font-bold">T-shirt Designer 3D</h1>
              <p className="text-sm opacity-90">CUSTOM DESIGN STUDIO</p>
            </div>
          </div>
          <div className="mt-2 text-xs opacity-75">
            Status: {modelError ? '⚠️ Using Fallback' : '✅ 3D Model Ready'}
          </div>
        </div>

        {/* Color Selection */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎨 Pilih Warna T-shirt
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setShirtColor(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                  shirtColor === color 
                    ? 'border-indigo-600 ring-2 ring-indigo-300' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={`Select ${color}`}
              />
            ))}
          </div>
          <input
            type="color"
            value={shirtColor}
            onChange={(e) => setShirtColor(e.target.value)}
            className="w-full mt-3 h-10 rounded-lg cursor-pointer"
          />
        </div>

        {/* Logo Upload */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🖼️ Upload Logo
          </h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <div className="space-y-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
            >
              📁 Pilih Gambar/Logo
            </button>
            {logoTexture && (
              <button
                onClick={() => setLogoTexture(null)}
                className="w-full py-2 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                🗑️ Hapus Logo
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">⚙️ Kontrol</h3>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isRotating 
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isRotating ? '⏸️ Stop Rotasi' : '▶️ Auto Rotate'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-3">
          <button
            className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-colors"
          >
            💾 Simpan Design
          </button>
          <button
            onClick={resetAll}
            className="w-full py-3 px-4 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            🔄 Reset Semua
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 p-8">
        <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden relative">
          <Canvas
            shadows
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            }}
          >
            <Environment />
            <Suspense fallback={<LoadingFallback />}>
              {modelError ? (
                <FallbackTshirt 
                  shirtColor={shirtColor}
                  logoTexture={logoTexture}
                />
              ) : (
                <TshirtModel 
                  shirtColor={shirtColor}
                  logoTexture={logoTexture}
                />
              )}
            </Suspense>
            <OrbitControls 
              enablePan={false}
              minDistance={4}
              maxDistance={12}
              autoRotate={isRotating}
              autoRotateSpeed={2}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
            />
          </Canvas>
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-full text-sm pointer-events-none">
            🖱️ Drag untuk memutar • 🔍 Scroll untuk zoom • {modelError ? '⚠️ Fallback Mode' : '✨ 3D Model Active'}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 italic">
            {modelError 
              ? '⚠️ Model 3D fallback - pastikan t_shirt.glb ada di folder public/' 
              : '✨ T-shirt Designer dengan model 3D dari t_shirt.glb!'
            }
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Framework: React Three Fiber • Renderer: Three.js • Model: {modelError ? 'Geometric Fallback' : 'GLTF'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Preload dengan error handling
try {
  useGLTF.preload('/t_shirt.glb');
} catch (error) {
  console.warn('Model preload failed, will use fallback');
}

export default TshirtDesigner3D;