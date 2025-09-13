import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import '../css/EditProfile.css';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [imageError, setImageError] = useState('');

  // --- BARU: State dan Ref untuk fitur kamera ---
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Canvas tersembunyi untuk mengambil gambar

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || 'N/A',
      });
      setProfileImage(user.profilePicture || null);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageError(''); 

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const maxSizeInBytes = 5 * 1024 * 1024; 

      if (!allowedTypes.includes(file.type)) {
        setImageError('*Tipe file harus JPG, PNG, atau WEBP.');
        e.target.value = null; 
        return; 
      }

      if (file.size > maxSizeInBytes) {
        setImageError('*Ukuran file tidak boleh lebih dari 5MB.');
        e.target.value = null;
        return; 
      }

      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageError || cameraError) return;

    const updatedData = {
      ...formData,
      profilePicture: profileImage,
    };
    
    updateUser(updatedData);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // --- BARU: Fungsi untuk membuka modal kamera ---
  const handleOpenCamera = async () => {
    setCameraError('');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraOpen(true);
        // Menunggu modal render, lalu set stream
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError('Gagal mengakses kamera. Pastikan Anda memberikan izin.');
      }
    } else {
      setCameraError('Kamera tidak didukung di browser ini.');
    }
  };

  // --- BARU: Fungsi untuk menutup modal dan mematikan stream kamera ---
  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Penting untuk mematikan kamera
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };
  
  // --- BARU: Fungsi untuk mengambil gambar dari video ---
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set ukuran canvas sesuai ukuran video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Gambar frame saat ini dari video ke canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Dapatkan data URL (Base64) dan update state
    const dataUrl = canvas.toDataURL('image/webp'); // Format webp lebih efisien
    setProfileImage(dataUrl);

    // Tutup kamera setelah selesai
    handleCloseCamera();
  };


  if (!user) {
    return <div className="profile-container loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        <h1 className="profile-title">Edit Your Profile</h1>
        
        <form onSubmit={handleSubmit} className="profile-form">
          
          <div className="profile-picture-section">
            <div 
              className="profile-picture-display"
              style={{ backgroundImage: `url(${profileImage})` }}
              aria-label="Profile Picture"
            >
              {!profileImage && <span className="placeholder-icon">👤</span>}
            </div>

            {imageError ? (
              <small className="image-error-message">{imageError}</small>
            ) : (
              <small className="image-guideline">
                Foto maksimal 5MB (JPG, PNG, WEBP)
              </small>
            )}

            {cameraError && <small className="image-error-message">{cameraError}</small>}

            <input 
              type="file" 
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
              id="file-upload"
            />
            
            {/* --- MODIFIKASI: Grup tombol --- */}
            <div className="button-group">
              <button 
                type="button" 
                className="upload-button" 
                onClick={() => fileInputRef.current.click()}
              >
                Upload Photo
              </button>
              {/* --- BARU: Tombol untuk membuka kamera --- */}
              <button 
                type="button" 
                className="camera-button"
                onClick={handleOpenCamera}
              >
                Take Photo
              </button>
            </div>
          </div>

          <div className="form-fields-section">
            {/* ... (bagian form-group tidak berubah) ... */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">Save Changes</button>
            </div>
            {successMessage && <div className="success-message">{successMessage}</div>}
          </div>
        </form>
      </div>

      {/* --- BARU: Canvas tersembunyi untuk proses pengambilan gambar --- */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {/* --- BARU: Modal untuk menampilkan kamera --- */}
      {isCameraOpen && (
        <div className="camera-modal-overlay">
          <div className="camera-modal-content">
            <video ref={videoRef} autoPlay playsInline className="camera-feed"></video>
            <div className="camera-modal-actions">
              <button onClick={handleCapture} className="capture-button">Capture</button>
              <button onClick={handleCloseCamera} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;