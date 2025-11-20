import { useState, useEffect } from 'react';
import { getUserSession, isAuthenticated } from '../utils/auth';

// Custom hook to get current user session
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const sessionData = getUserSession();
      const authenticated = isAuthenticated();
      
      setUser(sessionData.isLoggedIn ? sessionData : null);
      setAuthStatus(authenticated);
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    user,
    isAuthenticated: authStatus,
    loading
  };
};

export default useAuth;