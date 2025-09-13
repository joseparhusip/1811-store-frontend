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
    if (imageError) return;

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

            {/* --- DIMODIFIKASI: Tampilkan pesan error ATAU panduan statis --- */}
            {imageError ? (
              <small className="image-error-message">{imageError}</small>
            ) : (
              <small className="image-guideline">
                Foto maksimal 5MB (JPG, PNG, WEBP)
              </small>
            )}

            <input 
              type="file" 
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
              id="file-upload"
            />
            
            <button 
              type="button" 
              className="upload-button" 
              onClick={() => fileInputRef.current.click()}
            >
              Upload Photo
            </button>
          </div>

          <div className="form-fields-section">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button">Save Changes</button>
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;