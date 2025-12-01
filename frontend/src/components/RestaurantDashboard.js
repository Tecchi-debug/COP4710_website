import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

function RestaurantDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    offers: [],
    summary: {
      total_offers: 0,
      active_offers: 0,
      available_quantity: 0,
      reserved_quantity: 0
    }
  });
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state for creating offers
  const [formData, setFormData] = useState({
    plate_name: '',
    plate_description: '',
    price: '',
    qty: '',
    from_time: '',
    to_time: ''
  });

  const fetchDashboardData = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/cop4710_website/backend/api/restaurant/dashboard.php?restaurant_id=${user.userId}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
        setError('');
      } else {
        setError(data.error || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  const fetchPlates = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      const response = await fetch(`http://localhost/cop4710_website/backend/api/restaurant/plates.php?restaurant_id=${user.userId}`);
      const data = await response.json();
      
      if (data.success) {
        setPlates(data.plates);
      } else {
        setError(data.error || 'Failed to load plates');
      }
    } catch (err) {
      console.error('Error fetching plates:', err);
      setError('Network error. Please try again.');
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchDashboardData();
    fetchPlates();
  }, [fetchDashboardData, fetchPlates]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      plate_name: '',
      plate_description: '',
      price: '',
      qty: '',
      from_time: '',
      to_time: ''
    });
    setShowCreateForm(false);
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
          ...formData,
          restaurant_id: user.userId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Offer created successfully!');
        resetForm();
        fetchDashboardData();
        fetchPlates();
      } else {
        setError(data.error || 'Failed to create offer');
      }
    } catch (err) {
      console.error('Error creating offer:', err);
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

  const fillFormWithPlate = (plate) => {
    setFormData(prev => ({
      ...prev,
      plate_name: plate.plate_name,
      plate_description: plate.plate_description || ''
    }));
    setShowCreateForm(true);
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
          <h1>Restaurant Dashboard</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-create"
            disabled={showCreateForm}
          >
            Create New Offer
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {[
            { key: 'dashboard', label: 'Dashboard' },
            { key: 'offers', label: 'My Offers' },
            { key: 'plates', label: 'My Plates' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
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

        {/* Create Offer Form */}
        {showCreateForm && (
          <div id="login-box" className="create-offer-form">
            <h3>Create New Offer</h3>
            <form onSubmit={handleCreateOffer}>
              <div className="form-group">
                <label htmlFor="plate_name">Plate Name:</label>
                <input
                  type="text"
                  id="plate_name"
                  name="plate_name"
                  value={formData.plate_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Margherita Pizza"
                />
              </div>

              <div className="form-group">
                <label htmlFor="plate_description">Description:</label>
                <textarea
                  id="plate_description"
                  name="plate_description"
                  value={formData.plate_description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Describe the plate..."
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label htmlFor="price">Price ($):</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
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
                    value={formData.qty}
                    onChange={handleInputChange}
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
                    value={formData.from_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="to_time">Available Until:</label>
                  <input
                    type="datetime-local"
                    id="to_time"
                    name="to_time"
                    value={formData.to_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  Create Offer
                </button>
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Content */}
        {loading ? (
          <div className="loading-container">
            <h3>Loading...</h3>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Summary Cards */}
                <div className="summary-grid">
                  <div className="summary-card">
                    <div className="summary-number accent-color">
                      {dashboardData.summary.total_offers}
                    </div>
                    <div className="summary-label">Total Offers</div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-number success-color">
                      {dashboardData.summary.active_offers}
                    </div>
                    <div className="summary-label">Active Offers</div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-number accent-color">
                      {dashboardData.summary.available_quantity}
                    </div>
                    <div className="summary-label">Available Plates</div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-number warning-color">
                      {dashboardData.summary.reserved_quantity}
                    </div>
                    <div className="summary-label">Reserved Plates</div>
                  </div>
                </div>

                {/* Recent Offers */}
                <h3 className="section-title">Recent Offers</h3>
                {dashboardData.offers.slice(0, 5).map(offer => {
                  const status = getOfferStatus(offer);
                  return (
                    <div key={offer.offer_id} className="offer-card recent-offer">
                      <div>
                        <div className="offer-header">
                          <h4 className="offer-title">{offer.plate_name}</h4>
                          <span className={`offer-status status-${status.text.toLowerCase().replace(' ', '')}`}>
                            {status.text}
                          </span>
                        </div>
                        <div className="offer-details">
                          ${parseFloat(offer.price).toFixed(2)} • {offer.qty} available • Until {formatDateTime(offer.to_time)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Offers Tab */}
            {activeTab === 'offers' && (
              <div>
                {dashboardData.offers.length === 0 ? (
                  <div className="empty-state">
                    <h3>No offers yet</h3>
                    <p>Create your first offer to start selling surplus plates!</p>
                  </div>
                ) : (
                  <div className="offers-grid">
                    {dashboardData.offers.map(offer => {
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

            {/* Plates Tab */}
            {activeTab === 'plates' && (
              <div>
                {plates.length === 0 ? (
                  <div className="empty-state">
                    <h3>No plates yet</h3>
                    <p>Create an offer to add your first plate!</p>
                  </div>
                ) : (
                  <div className="plates-grid">
                    {plates.map(plate => (
                      <div key={plate.plate_id} className="plate-card">
                        <div>
                          <h3 className="plate-title">{plate.plate_name}</h3>
                          
                          {plate.plate_description && (
                            <p className="plate-description">{plate.plate_description}</p>
                          )}
                          
                          <div className="plate-details-grid">
                            <div>
                              <strong className="accent-text">Total Offers:</strong> {plate.total_offers}
                            </div>
                            <div>
                              <strong className="accent-text">Available:</strong> {plate.available_qty}
                            </div>
                            <div>
                              <strong className="accent-text">Price Range:</strong> 
                              {plate.min_price === plate.max_price 
                                ? ` $${parseFloat(plate.min_price).toFixed(2)}`
                                : ` $${parseFloat(plate.min_price).toFixed(2)} - $${parseFloat(plate.max_price).toFixed(2)}`
                              }
                            </div>
                            <div>
                              <strong className="accent-text">Last Offered:</strong> {formatDateTime(plate.last_offered)}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => fillFormWithPlate(plate)}
                          disabled={showCreateForm}
                          className="btn-create btn-compact"
                        >
                          Create New Offer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RestaurantDashboard;