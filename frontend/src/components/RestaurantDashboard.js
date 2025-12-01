import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

function RestaurantDashboard() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [plates, setPlates] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateOfferForm, setShowCreateOfferForm] = useState(false);
  const [showCreatePlateForm, setShowCreatePlateForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state for creating offers
  const [offerData, setOfferData] = useState({
    plate_id: '',
    price: '',
    qty: '',
    from_time: '',
    to_time: ''
  });

  // Form state for creating plates
  const [plateData, setPlateData] = useState({
    plate_name: '',
    plate_description: ''
  });

  const fetchRestaurantData = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      
      // Fetch restaurant name
      const userResponse = await fetch(`http://localhost/cop4710_website/backend/api/profile/get.php?user_id=${user.userId}`);
      const userData = await userResponse.json();
      if (userData.success && userData.user) {
        setRestaurantName(userData.user.name || userData.user.username || user.username || 'Restaurant');
      } else {
        setRestaurantName(user.username || 'Restaurant');
      }

      // Fetch offers
      const offersResponse = await fetch(`http://localhost/cop4710_website/backend/api/restaurant/dashboard.php?restaurant_id=${user.userId}`);
      const offersData = await offersResponse.json();
      if (offersData.success) {
        setOffers(offersData.offers || []);
      }

      // Fetch plates
      const platesResponse = await fetch(`http://localhost/cop4710_website/backend/api/restaurant/plates.php?restaurant_id=${user.userId}`);
      const platesData = await platesResponse.json();
      console.log('Plates API response:', platesData);
      if (platesData.success) {
        setPlates(platesData.plates || []);
        console.log('Plates loaded:', platesData.plates?.length || 0);
      } else {
        console.error('Plates API error:', platesData.error);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  const handleOfferInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlateInputChange = (e) => {
    const { name, value } = e.target;
    setPlateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetOfferForm = () => {
    setOfferData({
      plate_id: '',
      price: '',
      qty: '',
      from_time: '',
      to_time: ''
    });
    setShowCreateOfferForm(false);
    setError('');
    setSuccess('');
  };

  const resetPlateForm = () => {
    setPlateData({
      plate_name: '',
      plate_description: ''
    });
    setShowCreatePlateForm(false);
    setError('');
    setSuccess('');
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost/cop4710_website/backend/api/restaurant/create-offer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...offerData,
          restaurant_id: user.userId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Offer created successfully!');
        resetOfferForm();
        fetchRestaurantData();
      } else {
        setError(data.error || 'Failed to create offer');
      }
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleCreatePlate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost/cop4710_website/backend/api/restaurant/create-plate.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...plateData,
          restaurant_id: user.userId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Plate created successfully!');
        resetPlateForm();
        fetchRestaurantData();
      } else {
        setError(data.error || 'Failed to create plate');
      }
    } catch (err) {
      console.error('Error creating plate:', err);
      setError('Network error. Please try again.');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOfferStatus = (offer) => {
    const now = new Date();
    const endTime = new Date(offer.to_time);
    
    if (offer.qty === 0) return { text: 'SOLD OUT', color: '#ff6b6b' };
    if (endTime <= now) return { text: 'EXPIRED', color: '#666' };
    if (offer.is_active) return { text: 'ACTIVE', color: '#4caf50' };
    return { text: 'INACTIVE', color: '#ff9800' };
  };

  if (!user || user.userType !== 'Restaurant') {
    return (
      <div className="access-denied-container">
        <h2 className="access-denied-title">Access Denied</h2>
        <p className="access-denied-message">This page is only accessible to Restaurant accounts.</p>
        <div className="access-denied-roles">
          <strong>Required Role:</strong> Restaurant
        </div>
      </div>
    );
  }

  return (
    <div className="site-container">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{restaurantName}</h1>
          <div className="header-actions">
            <button
              onClick={() => setShowCreatePlateForm(true)}
              className="btn-create btn-secondary"
              disabled={showCreatePlateForm}
            >
              Create Plate
            </button>
            <button
              onClick={() => setShowCreateOfferForm(true)}
              className="btn-create"
              disabled={showCreateOfferForm || plates.length === 0}
              title={plates.length === 0 ? "Create a plate first" : "Make an offer"}
            >
              Make Offer {plates.length === 0 && "(Need plates first)"}
            </button>
          </div>
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

        {/* Create Plate Form */}
        {showCreatePlateForm && (
          <div id="login-box" className="create-plate-form">
            <h3>Create New Plate</h3>
            <form onSubmit={handleCreatePlate}>
              <div className="form-group">
                <label htmlFor="plate_name">Plate Name:</label>
                <input
                  type="text"
                  id="plate_name"
                  name="plate_name"
                  value={plateData.plate_name}
                  onChange={handlePlateInputChange}
                  required
                  placeholder="e.g. Margherita Pizza"
                />
              </div>

              <div className="form-group">
                <label htmlFor="plate_description">Description:</label>
                <textarea
                  id="plate_description"
                  name="plate_description"
                  value={plateData.plate_description}
                  onChange={handlePlateInputChange}
                  className="form-textarea"
                  placeholder="Describe the plate..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  Create Plate
                </button>
                <button type="button" onClick={resetPlateForm} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create Offer Form */}
        {showCreateOfferForm && (
          <div id="login-box" className="create-offer-form">
            <h3>Make New Offer</h3>
            <form onSubmit={handleCreateOffer}>
              <div className="form-group">
                <label htmlFor="plate_id">Select Plate:</label>
                <select
                  id="plate_id"
                  name="plate_id"
                  value={offerData.plate_id}
                  onChange={handleOfferInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose a plate...</option>
                  {plates.map(plate => (
                    <option key={plate.plate_id} value={plate.plate_id}>
                      {plate.plate_name} - {plate.plate_description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label htmlFor="price">Price ($):</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={offerData.price}
                    onChange={handleOfferInputChange}
                    required
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="qty">Surplus Quantity:</label>
                  <input
                    type="number"
                    id="qty"
                    name="qty"
                    value={offerData.qty}
                    onChange={handleOfferInputChange}
                    required
                    min="1"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label htmlFor="from_time">Available From:</label>
                  <input
                    type="datetime-local"
                    id="from_time"
                    name="from_time"
                    value={offerData.from_time}
                    onChange={handleOfferInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="to_time">Available Until:</label>
                  <input
                    type="datetime-local"
                    id="to_time"
                    name="to_time"
                    value={offerData.to_time}
                    onChange={handleOfferInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  Make Offer
                </button>
                <button type="button" onClick={resetOfferForm} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="loading-container">
            <h3>Loading...</h3>
          </div>
        ) : (
          <div>
            <h2 className="section-title">Current Offers</h2>
            {offers.length === 0 ? (
              <div className="empty-state">
                <h3>No offers yet</h3>
                <p>Create your first plate and then make an offer!</p>
              </div>
            ) : (
              <div className="offers-list">
                {offers.map(offer => {
                  const status = getOfferStatus(offer);
                  return (
                    <div key={offer.offer_id} className="offer-card">
                      <div className="offer-header">
                        <h3 className="offer-title">{offer.plate_name}</h3>
                        <span className={`offer-status status-${status.text.toLowerCase().replace(' ', '')}`}>
                          {status.text}
                        </span>
                      </div>
                      
                      {offer.plate_description && (
                        <p className="offer-description">{offer.plate_description}</p>
                      )}
                      
                      <div className="offer-details-grid">
                        <div>
                          <strong className="accent-text">Price:</strong> ${parseFloat(offer.price).toFixed(2)}
                        </div>
                        <div>
                          <strong className="accent-text">Available:</strong> {offer.qty}
                          {offer.reserved_qty > 0 && (
                            <span className="warning-text"> ({offer.reserved_qty} reserved)</span>
                          )}
                        </div>
                        <div>
                          <strong className="accent-text">From:</strong> {formatDateTime(offer.from_time)}
                        </div>
                        <div>
                          <strong className="accent-text">Until:</strong> {formatDateTime(offer.to_time)}
                        </div>
                        {offer.reservation_count > 0 && (
                          <div>
                            <strong className="accent-text">Reservations:</strong> {offer.reservation_count}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDashboard;