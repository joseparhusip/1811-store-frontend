// src/components/common/ErrorBoundary.jsx

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state agar render berikutnya akan menampilkan UI fallback.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // Anda juga bisa me-log error ke servis reporting
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Tampilkan UI fallback jika ada error
      return (
        <div className="canvas-fallback">
          <h2>Terjadi Masalah 😥</h2>
          <p>Gagal memuat model 3D. Beberapa kemungkinan penyebab:</p>
          <ul>
            <li>File <strong>tshirt.glb</strong> tidak ada di folder <strong>/public</strong>.</li>
            <li>Struktur internal file <strong>.glb</strong> tidak cocok dengan kode.</li>
            <li>Cek "Console" di browser (tekan F12) untuk detail error.</li>
          </ul>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#eee', padding: '10px', borderRadius: '5px' }}>
            {this.state.error.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;