import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Always provide a mock user
  const [user, setUser] = useState({
    _id: 'mock-user-id',
    name: 'Demo User',
    email: 'demo@example.com',
    credits: 999,
    subscription: 'pro',
    subscriptionExpires: '2099-12-31T23:59:59.999Z',
  });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('mock-token');

  // All auth functions are mocked
  const login = async () => ({ success: true });
  const register = async () => ({ success: true });
  const logout = () => {};
  const updateProfile = async () => ({ success: true });
  const refreshToken = async () => ({ success: true });
  const hasCredits = () => true;
  const getSubscriptionLevel = () => 'pro';
  const isSubscriptionActive = () => true;

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    hasCredits,
    getSubscriptionLevel,
    isSubscriptionActive,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 