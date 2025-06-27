// src/contexts/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Читаем при инициализации из localStorage
  const stored = localStorage.getItem('authData');
  const [authData, setAuthData] = useState(stored ? JSON.parse(stored) : null);

  const login = (data) => {
    setAuthData(data);
    localStorage.setItem('authData', JSON.stringify(data));
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('authData');
  };

  // Распаковываем роль и user из authData, если оно есть
  const role = authData?.role || null;
  const user = authData?.user || null;

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
