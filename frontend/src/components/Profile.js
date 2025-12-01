import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user, updateAuthState } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    addr: '',
    phone: '',
    c_card: '',
    user_type: '',
    created_at: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/cop4710_website/backend/api/profile/get.php?user_id=${user.userId}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
        setError('');
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost/cop4710_website/backend/api/profile/update.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.userId,
          name: profile.name,
          email: profile.email,
          addr: profile.addr,
          phone: profile.phone || null,
          c_card: profile.c_card || null
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Update the auth context if username changed
        if (profile.name !== user.username) {
          updateAuthState();
        }
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile(); // Reset to original data
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shouldShowField = (fieldName) => {
    const userType = profile.user_type;
    if (fieldName === 'phone') {
      return ['Restaurant', 'Customer', 'Donor'].includes(userType);
    }
    if (fieldName === 'c_card') {
      return ['Customer', 'Donor'].includes(userType);
    }
    return true;
  };

  if (!user) {
    return (
      <div className="site-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="site-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="site-container">
      <div id="login-box" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>My Profile</h2>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="btn-edit"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="user_type">Account Type:</label>
            <div className="profile-field profile-field-readonly" style={{ fontWeight: 'bold' }}>
              {profile.user_type}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Username:</label>
            {isEditing ? (
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                required
              />
            ) : (
              <div className="profile-field profile-field-readonly">
                {profile.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                required
              />
            ) : (
              <div className="profile-field profile-field-readonly">
                {profile.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="addr">Address:</label>
            {isEditing ? (
              <input
                type="text"
                id="addr"
                name="addr"
                value={profile.addr || ''}
                onChange={handleInputChange}
              />
            ) : (
              <div className="profile-field profile-field-readonly">
                {profile.addr || 'Not provided'}
              </div>
            )}
          </div>

          {shouldShowField('phone') && (
            <div className="form-group">
              <label htmlFor="phone">Phone Number:</label>
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="profile-field profile-field-readonly">
                  {profile.phone || 'Not provided'}
                </div>
              )}
            </div>
          )}

          {shouldShowField('c_card') && (
            <div className="form-group">
              <label htmlFor="c_card">Credit Card:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="c_card"
                  name="c_card"
                  value={profile.c_card || ''}
                  onChange={handleInputChange}
                  placeholder="****-****-****-1234"
                />
              ) : (
                <div className="profile-field profile-field-readonly">
                  {profile.c_card ? '****-****-****-' + profile.c_card.slice(-4) : 'Not provided'}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Member Since:</label>
            <div className="profile-field profile-field-readonly">
              {formatDate(profile.created_at)}
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button
                type="submit"
                disabled={saving}
                className="btn-save"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
