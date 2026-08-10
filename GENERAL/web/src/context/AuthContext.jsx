import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await api.auth.getProfile();
        setUser(userData);
      }
    } catch (e) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const { user: userData, token } = await api.auth.login({ email, password });
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  }

  async function register(name, email, password, phone) {
    const { user: userData, token } = await api.auth.register({ name, email, password, phone });
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  }

  async function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
