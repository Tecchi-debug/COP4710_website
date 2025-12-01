import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Restaurants() {
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Restaurant Dashboard</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              background: 'var(--accent)',
              color: 'var(--text)',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
            disabled={showCreateForm}
          >
            Create New Offer
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          borderBottom: '2px solid var(--nav)'
        }}>
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
          <div style={{ 
            background: '#ff4444', 
            color: 'white', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            background: '#4caf50', 
            color: 'white', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem' 
          }}>
            {success}
          </div>
        )}

        {/* Create Offer Form */}
        {showCreateForm && (
          <div id="login-box" style={{ marginBottom: '2rem' }}>
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
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
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

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" style={{
                  flex: 1,
                  background: 'var(--accent)',
                  color: 'var(--text)',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}>
                  Create Offer
                </button>
                <button type="button" onClick={resetForm} style={{
                  flex: 1,
                  background: '#666',
                  color: 'var(--text)',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Loading...</h3>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Summary Cards */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem', 
                  marginBottom: '2rem' 
                }}>
                  <div style={{
                    background: 'var(--nav)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(242,166,65,0.3)',
                    textAlign: 'center'
                  }}>
                    <div className="summary-number" style={{ color: 'var(--accent)' }}>
                      {dashboardData.summary.total_offers}
                    </div>
                    <div className="summary-label">Total Offers</div>
                  </div>

                  <div style={{
                    background: 'var(--nav)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(242,166,65,0.3)',
                    textAlign: 'center'
                  }}>
                    <div className="summary-number" style={{ color: '#4caf50' }}>
                      {dashboardData.summary.active_offers}
                    </div>
                    <div className="summary-label">Active Offers</div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-number" style={{ color: 'var(--accent)' }}>
                      {dashboardData.summary.available_quantity}
                    </div>
                    <div className="summary-label">Available Plates</div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-number" style={{ color: '#ff9800' }}>
                      {dashboardData.summary.reserved_quantity}
                    </div>
                    <div className="summary-label">Reserved Plates</div>
                  </div>
                </div>

                {/* Recent Offers */}
                <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Recent Offers</h3>
                {dashboardData.offers.slice(0, 5).map(offer => {
                  const status = getOfferStatus(offer);
                  return (
                    <div key={offer.offer_id} style={{
                      background: 'var(--nav)',
                      border: '1px solid rgba(242,166,65,0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, color: 'var(--accent)' }}>{offer.plate_name}</h4>
                          <span style={{
                            background: status.color,
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            {status.text}
                          </span>
                        </div>
                        <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
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
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {dashboardData.offers.map(offer => {
                      const status = getOfferStatus(offer);
                      return (
                        <div key={offer.offer_id} style={{
                          background: 'var(--nav)',
                          border: '1px solid rgba(242,166,65,0.3)',
                          borderRadius: '8px',
                          padding: '1.5rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--accent)' }}>{offer.plate_name}</h3>
                            <span className={`offer-status status-${status.text.toLowerCase().replace(' ', '')}`}>
                              {status.text}
                            </span>
                          </div>
                          
                          {offer.plate_description && (
                            <p style={{ color: '#ccc', marginBottom: '1rem' }}>{offer.plate_description}</p>
                          )}
                          
                          <div className="offer-details-grid">
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>Price:</strong> ${parseFloat(offer.price).toFixed(2)}
                            </div>
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>Available:</strong> {offer.qty}
                              {offer.reserved_qty > 0 && (
                                <span style={{ color: '#ff9800' }}> ({offer.reserved_qty} reserved)</span>
                              )}
                            </div>
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>From:</strong> {formatDateTime(offer.from_time)}
                            </div>
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>Until:</strong> {formatDateTime(offer.to_time)}
                            </div>
                            {offer.reservation_count > 0 && (
                              <div>
                                <strong style={{ color: 'var(--accent)' }}>Reservations:</strong> {offer.reservation_count}
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
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {plates.map(plate => (
                      <div key={plate.plate_id} className="plate-card">
                        <div>
                          <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--accent)' }}>{plate.plate_name}</h3>
                          
                          {plate.plate_description && (
                            <p style={{ color: '#ccc', marginBottom: '1rem' }}>{plate.plate_description}</p>
                          )}
                          
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                            gap: '1rem', 
                            fontSize: '0.9rem' 
                          }}>
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>Total Offers:</strong> {plate.total_offers}
                            </div>
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>Available:</strong> {plate.available_qty}
                            </div>
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>Price Range:</strong> 
                              {plate.min_price === plate.max_price 
                                ? ` $${parseFloat(plate.min_price).toFixed(2)}`
                                : ` $${parseFloat(plate.min_price).toFixed(2)} - $${parseFloat(plate.max_price).toFixed(2)}`
                              }
                            </div>
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>Last Offered:</strong> {formatDateTime(plate.last_offered)}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => fillFormWithPlate(plate)}
                          disabled={showCreateForm}
                          style={{
                            background: 'var(--accent)',
                            color: 'var(--text)',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            whiteSpace: 'nowrap'
                          }}
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

export default Restaurants;