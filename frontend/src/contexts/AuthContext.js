import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserSession, isAuthenticated as checkAuth, clearUserSession } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateAuthState = () => {
    const sessionData = getUserSession();
    const authenticated = checkAuth();
    
    setUser(sessionData.isLoggedIn ? sessionData : null);
    setIsAuthenticated(authenticated);
    setLoading(false);
  };

  useEffect(() => {
    updateAuthState();
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      updateAuthState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData) => {
    setUser({
      username: userData.username,
      userType: userData.user_type,
      userId: userData.user_id,
      isLoggedIn: true
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearUserSession();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};