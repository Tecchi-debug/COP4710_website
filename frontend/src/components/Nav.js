import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserType } from '../utils/auth';

function Nav() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // idk how the pages are going to be structured yet
  const getDashboardLink = () => {
    const userType = getUserType();
    switch (userType) {
      case 'Administrator':
        return '/admin-dashboard';
      case 'Restaurant':
        return '/restaurant-dashboard';
      case 'Customer':
        return '/customer-dashboard';
      case 'Donor':
        return '/donor-dashboard';
      case 'Needy':
        return '/needy-dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="nav-container">
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/restaurants">Restaurants</Link>
      </div>
      
      <div className="nav-right">
        {isAuthenticated ? (
          <div className="dropdown-container">
            <button
              onClick={toggleDropdown}
              className="dropdown-toggle"
            >
              {user?.username} ({user?.userType})
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link
                  to={getDashboardLink()}
                  onClick={() => setDropdownOpen(false)}
                  className="dropdown-item"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="dropdown-item"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="dropdown-logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;