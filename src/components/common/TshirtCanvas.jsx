// src/components/common/TshirtCanvas.jsx

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Decal, useTexture } from '@react-three/drei';

// --- PERUBAHAN 1 ---
// Komponen Model sekarang akan menerima `logoUrl` (string path gambar)
// dan akan memanggil `useTexture` di DALAM dirinya sendiri.
function Model({ shirtColor, logoUrl }) {
  const { nodes, materials } = useGLTF('/tshirt.glb');

  // `useTexture` sekarang aman dipanggil di sini karena komponen Model
  // dirender di dalam <Canvas>.
  const logoTexture = useTexture(logoUrl || '');

  // Log ini masih berguna untuk debugging jika nama material/node berbeda
  // console.log("Struktur Model 3D:", { nodes, materials });

  const shirtMaterial = materials.lambert1.clone();
  shirtMaterial.color.set(shirtColor);

  return (
    <mesh
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={shirtMaterial}
      dispose={null}
    >
      {/* Kita gunakan `logoUrl` untuk mengecek apakah harus merender Decal */}
      {logoUrl && (
        <Decal
          position={[0, 0.04, 0.15]}
          rotation={[0, 0, 0]}
          scale={0.15}
          map={logoTexture} // `logoTexture` dari `useTexture` di atas
          depthTest={false}
          depthWrite={true}
        />
      )}
    </mesh>
  );
}

const TshirtCanvas = ({ shirtColor, logoUrl }) => {
  // --- PERUBAHAN 2 ---
  // Hapus pemanggilan `useTexture` dari sini.
  // const logoTexture = useTexture(logoUrl || ''); // <-- HAPUS BARIS INI

  return (
    <Canvas shadows camera={{ position: [0, 0, 0.8], fov: 25 }}>
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[0, 5, 5]} 
        intensity={1.5} 
        castShadow
      />
      <OrbitControls 
        enableZoom={true}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2}
      />
      {/* --- PERUBAHAN 3 ---
          Kirim prop `logoUrl` langsung ke Model, bukan `logoTexture`.
          Biarkan komponen Model yang mengurus pemanggilan `useTexture`. */}
      <Model 
        shirtColor={shirtColor}
        logoUrl={logoUrl} 
      />
    </Canvas>
  );
};

useGLTF.preload('/tshirt.glb');

export default TshirtCanvas;

// --- CATATAN PENTING ---
// Pada file yang kamu unggah, ada kurung kurawal } ekstra di akhir file setelah
// export default. Itu adalah syntax error. Pastikan itu juga dihapus ya!