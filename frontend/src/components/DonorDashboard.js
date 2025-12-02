import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const DonorDashboard = () => {
  const { user } = useAuth(); // assumes user_id and role are in context
  const [offers, setOffers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState({});

  const API_BASE = "http://localhost/COP4710_website/backend/api";

  // Fetch all active offers
  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/offers/list.php`);
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  };

  // Fetch donor's reservations
  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reservations/list.php?user_id=${user.user_id}`);
      setReservations(res.data.reservations || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchReservations();
  }, []);

  // Handle checkbox toggle
  const toggleSelect = (offer_id) => {
    setSelectedOffers((prev) => ({
      ...prev,
      [offer_id]: prev[offer_id] ? 0 : 1, // quantity = 1 by default
    }));
  };

  // Make reservation
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
    try {
      await axios.post(`${API_BASE}/reservations/checkout.php`, {
        user_id: user.user_id,
      });
      fetchReservations();
      alert('Donations confirmed!');
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
        <button onClick={handleReserve} disabled={Object.keys(selectedOffers).length === 0}>
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
