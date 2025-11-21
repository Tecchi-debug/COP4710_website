import React, { useEffect, useState } from 'react';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch offers from backend
    async function fetchOffers() {
      try {
        const res = await fetch('http://localhost/wnk/backend/api/offers/list.php');
        const data = await res.json();
        if (data.success) {
          setOffers(data.offers);
        } else {
          setError(data.error || 'Failed to fetch offers');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  if (loading) return <div>Loading offers...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  if (offers.length === 0) return <div>No offers available at the moment.</div>;

  return (
    <div className="offers-container">
      <h2>Available Plates</h2>
      <div className="offers-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {offers.map((offer) => (
          <div key={offer.offer_id} className="offer-card" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
            <h3>{offer.plate_name}</h3>
            <p>{offer.plate_description}</p>
            <p><strong>Restaurant:</strong> {offer.restaurant_name}</p>
            <p><strong>Price:</strong> ${offer.price}</p>
            <p><strong>Available:</strong> {offer.qty}</p>
            <p><strong>From:</strong> {new Date(offer.from_time).toLocaleString()}</p>
            <p><strong>To:</strong> {new Date(offer.to_time).toLocaleString()}</p>
            <button
              onClick={() => alert(`Reserve ${offer.plate_name} feature coming soon!`)}
              style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Reserve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Offers;
