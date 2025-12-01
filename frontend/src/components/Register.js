import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [memberType, setMemberType] = useState('Restaurant');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneValue = phoneNumber || 'N/A';
    const cardValue = creditCard || 'N/A';
    const userData = { username, address,email, password, memberType, phoneNumber: phoneValue, creditCard: cardValue };
    console.log('Register:', userData);

    fetch('http://localhost/cop4710_website/backend/api/auth/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        if (data.message) {
          setSuccess('Registration successful! Redirecting to login...');
          setError('');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (data.error) {
          setError(data.error);
          setSuccess('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Network error. Please try again.');
        setSuccess('');
      });

  };

  // Determine if phone number and credit card should be shown
  const showPhoneField = ['Restaurant', 'Donor', 'Customer'].includes(memberType);
  const showCardField = ['Customer', 'Donor'].includes(memberType);

  return (
    <div id="login-box">
      <h2>Register</h2>
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
          <label htmlFor="address">address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        
        <div className="form-group">
          <label htmlFor="member_type">Member Type:</label>
          <select 
            id="member_type" 
            name="member_type"
            className="form-select"
            value={memberType}
            onChange={(e) => setMemberType(e.target.value)}
            required
          >
            <option value="Restaurant">Restaurant</option>
            <option value="Customer">Customer</option>
            <option value="Donor">Donor</option>
            <option value="Needy">Needy</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>

        {showPhoneField && (
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number:</label>
            <input
              type="tel"
              id="phone_number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        )}

        {showCardField && (
          <div className="form-group">
            <label htmlFor="credit_card">Credit Card:</label>
            <input
              type="text"
              id="credit_card"
              value={creditCard}
              onChange={(e) => setCreditCard(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit">Register</button>
        
        {error && (
          <div className="error-message" style={{color: 'red', marginTop: '10px'}}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message" style={{color: 'green', marginTop: '10px'}}>
            {success}
          </div>
        )}
      </form>
    </div>
  );
}

export default Register;
