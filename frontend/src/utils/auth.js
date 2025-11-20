import Cookies from 'js-cookie';

// Cookie names
const USER_SESSION_COOKIE = 'user_session';
const USER_TYPE_COOKIE = 'user_type';
const USER_ID_COOKIE = 'user_id';

// Set user session (called on successful login)
export const setUserSession = (userData) => {
  const { user_id, username, user_type } = userData;
  
  // Set cookies with 7 days expiration
  const cookieOptions = {
    expires: 7, // 7 days
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax'
  };

  Cookies.set(USER_SESSION_COOKIE, username, cookieOptions);
  Cookies.set(USER_TYPE_COOKIE, user_type, cookieOptions);
  Cookies.set(USER_ID_COOKIE, user_id.toString(), cookieOptions);
};

// Get current user session
export const getUserSession = () => {
  const username = Cookies.get(USER_SESSION_COOKIE);
  const userType = Cookies.get(USER_TYPE_COOKIE);
  const userId = Cookies.get(USER_ID_COOKIE);

  if (username && userType && userId) {
    return {
      username,
      userType,
      userId: parseInt(userId),
      isLoggedIn: true
    };
  }
  
  return {
    username: null,
    userType: null,
    userId: null,
    isLoggedIn: false
  };
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!Cookies.get(USER_SESSION_COOKIE);
};

// Check if user has specific role
export const hasRole = (requiredRole) => {
  const userType = Cookies.get(USER_TYPE_COOKIE);
  return userType === requiredRole;
};

// Clear user session (logout)
export const clearUserSession = () => {
  Cookies.remove(USER_SESSION_COOKIE);
  Cookies.remove(USER_TYPE_COOKIE);
  Cookies.remove(USER_ID_COOKIE);
};

// Get user type for routing
export const getUserType = () => {
  return Cookies.get(USER_TYPE_COOKIE);
};

// Get user ID
export const getUserId = () => {
  const userId = Cookies.get(USER_ID_COOKIE);
  return userId ? parseInt(userId) : null;
};