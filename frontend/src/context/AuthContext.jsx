import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AUTH_STORAGE_KEY = 'workpulse_auth_session';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session & verify against backend
  useEffect(() => {
    async function initAuth() {
      const token = api.getToken();
      if (token) {
        try {
          const user = await api.getMe();
          setCurrentUser(user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } catch {
          // Token expired or invalid
          api.logout();
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setCurrentUser(null);
        }
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setCurrentUser(null);
      }
      setIsLoading(false);
    }
    initAuth();

    const handleUnauthorized = () => {
      setCurrentUser(null);
    };
    window.addEventListener('workpulse_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('workpulse_unauthorized', handleUnauthorized);
  }, []);

  const login = async ({ email, password, rememberMe = true }) => {
    const data = await api.login(email, password, rememberMe);
    setCurrentUser(data.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
    return data.user;
  };

  const register = async ({ name, email, password }) => {
    const data = await api.register(name, email, password);
    setCurrentUser(data.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    api.logout();
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
  };

  const resetPassword = async ({ newPassword }) => {
    await api.resetPassword(newPassword);
    return true;
  };

  const updateProfile = async (updates) => {
    try {
      const updated = await api.updateProfile(updates);
      setCurrentUser(updated);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('[updateProfile Error]', err);
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      await api.deleteAccount();
    } finally {
      logout();
    }
  };

  const markEmailVerified = async () => {
    try {
      await api.verifyEmail();
      if (currentUser) {
        const updated = { ...currentUser, is_email_verified: true, isEmailVerified: true };
        setCurrentUser(updated);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      if (currentUser) {
        const updated = { ...currentUser, is_email_verified: true, isEmailVerified: true };
        setCurrentUser(updated);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        markEmailVerified,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
