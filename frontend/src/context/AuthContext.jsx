import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import userService from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const data = await userService.getMe();
      setUser(data);
      return data;
    } catch {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async ({ access, refresh }) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    setLoading(true);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshUser: fetchUser,
    setUser,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
