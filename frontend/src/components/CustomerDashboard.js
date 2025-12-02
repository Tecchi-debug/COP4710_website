import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

function CustomerDashboard() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingRes, setLoadingRes] = useState(true);
  const [error, setError] = useState(null);
  
  // Load available offers
  const API_BASE = "http://localhost/COP4710_website/backend/api";
  
  const loadOffers = async () => {
    try {
      setLoadingOffers(true);
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
      setLoadingOffers(false);
    }
  };

  // Load user's reservations
  const loadReservations = async () => {
    try {
      setLoadingRes(true);
      const response = await fetch(`${API_BASE}/reservations/list.php?user_id=${user.user_id}`);
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
    loadReservations();
  }, []);

  // Make reservation
  const reserveOffer = async (offerId) => {
    try {
      const res = await fetch(`${API_BASE}/reservations/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reserved_by_id: user.user_id,
          reserved_for_id: user.user_id, // customers reserve for themselves
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

  // Checkout: confirm pending reservations
  const checkout = async () => {
    try {
      const res = await fetch("${API_BASE}/reservations/checkout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Checkout failed.");
        return;
      }

      alert("Checkout complete!");
      loadReservations();
    } catch (err) {
      alert("Checkout error.");
    }
  };

  // UI rendering
  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      {/* --------------------- Offers --------------------- */}
      <h2>Available Surplus Plates</h2>
      {loadingOffers ? (
        <p>Loading offers...</p>
      ) : offers.length === 0 ? (
        <p>No offers available.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {offers.map((offer) => (
            <div
              key={offer.offer_id}
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "8px",
                width: "250px"
              }}
            >
              <h3>{offer.plate_name}</h3>
              <p>{offer.plate_description}</p>
              <p><strong>Price:</strong> ${offer.price}</p>
              <p><strong>Qty left:</strong> {offer.qty}</p>
              <button onClick={() => reserveOffer(offer.offer_id)}>Reserve</button>
            </div>
          ))}
        </div>
      )}

      {/* --------------------- Reservations --------------------- */}
      <h2 style={{ marginTop: "40px" }}>Your Pending Reservations</h2>
      {loadingRes ? (
        <p>Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        <>
          <ul>
            {reservations.map((r) => (
              <li key={r.reservation_id}>
                {r.plate_name} — Qty: {r.qty} — Status: {r.status}
              </li>
            ))}
          </ul>
          <button onClick={checkout}>Checkout</button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default CustomerDashboard;
