import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole, getUserType } from '../utils/auth';

// Component to protect routes that require authentication
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    const currentUserType = getUserType();
    return (
      <div className="access-denied-container">
        <h2 className="access-denied-title">Access Denied</h2>
        <p className="access-denied-message">
          You don't have permission to access this page.
        </p>
        <p className="access-denied-roles">
          Required role: <strong>{requiredRole}</strong><br/>
          Your current role: <strong>{currentUserType || 'Unknown'}</strong>
        </p>
        <button 
          onClick={() => window.history.back()} 
          className="go-back-button"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return children;
};

// Higher-order component for role-based access
export const withRoleAccess = (Component, requiredRole) => {
  return (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export default ProtectedRoute;