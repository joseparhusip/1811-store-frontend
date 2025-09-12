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

    // Data dummy yang valid
    const validEmail = 'sarah@gmail.com';
    const validPassword = 'sarah123';

    // Cek apakah email dan password sesuai
    if (email === validEmail && password === validPassword) {
      const userToSave = { email: email };
      
      // Simpan data user di state
      setUser(userToSave); 
      
      // Simpan data user di localStorage agar tidak hilang saat refresh
      localStorage.setItem('user', JSON.stringify(userToSave));
      
      // Tandai bahwa login baru saja berhasil untuk menampilkan notifikasi
      localStorage.setItem('justLoggedIn', 'true');

      // Redirect ke halaman utama setelah login
      navigate('/'); 
      
      return true; // Kembalikan true jika berhasil
    } else {
      // Jika gagal, bisa tambahkan alert atau state untuk pesan error
      alert('Email atau password salah!');
      return false; // Kembalikan false jika gagal
    }
  };

  // --- FUNGSI LOGOUT ---
  const logout = () => {
    setUser(null); 
    localStorage.removeItem('user'); // Hapus user dari localStorage
    localStorage.removeItem('justLoggedIn'); // Hapus penanda notifikasi
    navigate('/login'); 
  };
  
  // Nilai yang akan disediakan untuk komponen lain
  const value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};