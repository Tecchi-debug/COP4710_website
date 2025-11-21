import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserSession } from '../utils/auth';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { username, password });
    
    fetch('http://localhost/cop4710_website/backend/api/auth/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), 
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        
        if (data.success) {
          // Set user session in cookies
          setUserSession({
            user_id: data.user_id,
            username: data.username,
            user_type: data.user_type
          });
          
          // Update auth context
          login({
            user_id: data.user_id,
            username: data.username,
            user_type: data.user_type
          });
          
          // Redirect based on user type
          const userType = data.user_type || data.memberType;
          
          switch (userType) {
            case 'Administrator':
              navigate('/admin');
              break;
            case 'Restaurant':
              navigate('/restaurant-dashboard');
              break;
            case 'Customer':
              navigate('/customer-dashboard');
              break;
            case 'Donor':
              navigate('/donor-dashboard');
              break;
            case 'Needy':
              navigate('/needy-dashboard');
              break;
            default:
              navigate('/'); // Default home page
          }
        } else {
          setError(data.error || 'Login failed');
          console.error('Login failed:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show an error message)
      });    
  };

  return (
    <div id="login-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Login</button>
        
        {error && (
          <div className="error-message" style={{color: 'red', marginTop: '10px'}}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
