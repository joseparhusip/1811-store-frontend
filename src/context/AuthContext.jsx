// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Coba ambil user dari localStorage saat awal aplikasi dimuat
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  // --- FUNGSI LOGIN DENGAN VALIDASI DUMMY ---
  const login = (userData) => {
    const { email, password } = userData;

    // --- PERUBAHAN: Menggunakan array untuk data dummy yang valid ---
    const validUsers = [
      { email: 'sarah@gmail.com', password: 'sarah123', name: 'Sarah Connor', phone: '081234567890' },
      { email: 'test@gmail.com', password: 'test123', name: 'Test User', phone: '081111111111' },
      { email: 'contoh@gmail.com', password: 'contoh123', name: 'Contoh Akun', phone: '082222222222' }
    ];

    // Cek apakah email dan password sesuai dengan salah satu data di array
    const foundUser = validUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      // Buat objek pengguna untuk disimpan, tanpa password
      const userToSave = { 
        email: foundUser.email,
        name: foundUser.name,
        phone: foundUser.phone,
        profilePicture: null, // Mulai tanpa gambar profil
      };
      
      setUser(userToSave); 
      localStorage.setItem('user', JSON.stringify(userToSave));
      localStorage.setItem('justLoggedIn', 'true'); // Tandai bahwa pengguna baru saja login
      navigate('/'); 
      
      return true;
    } else {
      return false;
    }
  };

  // --- FUNGSI LOGOUT ---
  const logout = () => {
    setUser(null); 
    localStorage.removeItem('user');
    localStorage.removeItem('justLoggedIn');
    navigate('/login'); 
  };
  
  // --- FUNGSI UNTUK MEMPERBARUI PROFIL PENGGUNA ---
  const updateUser = (newUserData) => {
    // Gabungkan data pengguna sebelumnya dengan data baru
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  // Nilai yang akan disediakan untuk komponen lain
  const value = { user, login, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};