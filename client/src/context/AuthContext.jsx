import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = (token, nextUser) => {
    localStorage.setItem('nexhood_token', token);
    localStorage.setItem('nexhood_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem('nexhood_token');
    localStorage.removeItem('nexhood_user');
    setUser(null);
  };

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('nexhood_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { user: profile } = await authService.me();
        setUser(profile);
        localStorage.setItem('nexhood_user', JSON.stringify(profile));
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const login = async (payload) => {
    const { token, user: nextUser } = await authService.login(payload);
    persistSession(token, nextUser);
    return nextUser;
  };

  const register = async (payload) => {
    const { token, user: nextUser } = await authService.register(payload);
    persistSession(token, nextUser);
    return nextUser;
  };

  const loginWithGoogle = async (credential) => {
    const { token, user: nextUser } = await authService.loginWithGoogle(credential);
    persistSession(token, nextUser);
    return nextUser;
  };

  const logout = () => {
    clearSession();
  };

  const updateUser = (nextUser) => {
    localStorage.setItem('nexhood_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      updateUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


