import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DonorDashboard = () => {
  const { user, loading: authLoading } = useAuth(); // use loading flag
  const [offers, setOffers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState({});
  const [loadingRes, setLoadingRes] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost/COP4710_website/backend/api";

  // Load available offers
  const loadOffers = async () => {
    try {
      const response = await fetch(`${API_BASE}/offers/list.php`);
      const data = await response.json();
      if (data.success) {
        setOffers(data.offers || []);
      } else {
        setError("Failed to load offers");
      }
    } catch (err) {
      setError("Error loading offers");
    } finally {
      // Loading complete
    }
  };
  
  // Load user's reservations
  const loadReservations = async () => {
    if (!user || !user.userId) return;
    
    try {
      setLoadingRes(true);
      const response = await fetch(`${API_BASE}/reservations/list.php?user_id=${user.userId}`);
      const data = await response.json();
      if (data.success) {
        setReservations(data.reservations || []);
      } else {
        setError("Failed to load reservations");
      }
    } catch (err) {
      setError("Error loading reservations");
    } finally {
      setLoadingRes(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      loadReservations(); // wait until user is loaded
    }
  }, [authLoading, user]);

  // Handle checkbox toggle
  const toggleSelect = (offer_id) => {
    setSelectedOffers((prev) => ({
      ...prev,
      [offer_id]: prev[offer_id] ? 0 : 1, // quantity = 1 by default
    }));
  };

  // Make reservations for selected offers
  const handleReserve = async () => {
    if (!user?.userId) return;
    
    const selectedOfferIds = Object.keys(selectedOffers).filter(id => selectedOffers[id] > 0);
    
    try {
      for (const offerId of selectedOfferIds) {
        const res = await fetch(`${API_BASE}/reservations/create.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reserved_by_id: user.userId,
            reserved_for_id: null, // donation
            offer_id: offerId,
            qty: selectedOffers[offerId]
          }),
        });

        const data = await res.json();
        if (!data.success) {
          alert(`Failed to reserve offer ${offerId}.`);
          return;
        }
      }

      alert("Reservations created for donation!");
      setSelectedOffers({}); // Clear selections
      loadReservations();
    } catch (err) {
      alert("Error creating reservations.");
    }
  };

  // Make reservation (old function)
  const reserveOffer = async (offerId) => {
    if (!user || !user.userId) return;
    
    try {
      const res = await fetch(`${API_BASE}/reservations/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reserved_by_id: user.userId,
          reserved_for_id: null, // donation
          offer_id: offerId,
          qty: 1
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Failed to reserve.");
        return;
      }

      alert("Reservation created!");
      loadReservations();
    } catch (err) {
      alert("Error creating reservation.");
    }
  };

  // Simple checkout: mark all pending reservations as CONFIRMED
  const handleCheckout = async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`${API_BASE}/reservations/checkout.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.userId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadReservations();
        alert('Donations confirmed!');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Donor Dashboard</h2>

      <section>
        <h3>Available Offers</h3>
        {offers.length === 0 && <p>No offers available right now.</p>}
        <ul>
          {offers.map((offer) => (
            <li key={offer.offer_id}>
              <input
                type="checkbox"
                checked={!!selectedOffers[offer.offer_id]}
                onChange={() => toggleSelect(offer.offer_id)}
              />
              {offer.plate_name} - ${offer.price} ({offer.qty} available)
            </li>
          ))}
        </ul>
        <button onClick={handleReserve} disabled={Object.keys(selectedOffers).filter(id => selectedOffers[id] > 0).length === 0}>
          Reserve for Donation
        </button>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>Your Pending Donations</h3>
        {reservations.length === 0 && <p>No pending reservations.</p>}
        <ul>
          {reservations.map((resv) => (
            <li key={resv.reservation_id}>
              {resv.plate_name} - {resv.qty} plate(s) - Status: {resv.status}
            </li>
          ))}
        </ul>
        {reservations.length > 0 && (
          <button onClick={handleCheckout}>Confirm Donations</button>
        )}
      </section>
    </div>
  );
};

export default DonorDashboard;
