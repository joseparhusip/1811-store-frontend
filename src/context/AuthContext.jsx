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
      // Create a more complete user object
      const userToSave = { 
        email: email,
        name: 'Sarah Connor', // Add default name
        phone: '081234567890', // Add default phone
        profilePicture: null, // Start with no picture
      };
      
      setUser(userToSave); 
      localStorage.setItem('user', JSON.stringify(userToSave));
      localStorage.setItem('justLoggedIn', 'true');
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
  
  // --- NEW FUNCTION TO UPDATE USER PROFILE ---
  const updateUser = (newUserData) => {
    // Merge previous user data with new data
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  // Nilai yang akan disediakan untuk komponen lain
  const value = { user, login, logout, updateUser }; // <-- EXPOSE updateUser HERE

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};