import React, { useEffect, useState } from 'react';

function OfferDetails({ offerId }) {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!offerId) return;

    async function fetchOffer() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost/wnk/backend/api/offers/details.php?offer_id=${offerId}`);
        const data = await res.json();
        if (data.success) {
          setOffer(data.offer);
        } else {
          setError(data.error || 'Failed to fetch offer details');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOffer();
  }, [offerId]);

  if (loading) return <div>Loading offer details...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!offer) return <div>No offer found.</div>;

  return (
    <div className="offer-details" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>{offer.plate_name}</h2>
      <p>{offer.plate_description}</p>
      <p><strong>Restaurant:</strong> {offer.restaurant_name}</p>
      <p><strong>Price:</strong> ${offer.price}</p>
      <p><strong>Available Quantity:</strong> {offer.qty}</p>
      <p><strong>From:</strong> {new Date(offer.from_time).toLocaleString()}</p>
      <p><strong>To:</strong> {new Date(offer.to_time).toLocaleString()}</p>
      <button
        onClick={() => alert(`Reserve ${offer.plate_name} feature coming soon!`)}
        style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
      >
        Reserve
      </button>
    </div>
  );
}

export default OfferDetails;
