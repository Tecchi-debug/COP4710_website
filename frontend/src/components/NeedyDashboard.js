import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const NeedyDashboard = () => {
  const { user } = useContext(AuthContext); // current logged-in needy user
  const [freePlates, setFreePlates] = useState([]);
  const [selectedPlates, setSelectedPlates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFreePlates();
  }, []);

  const fetchFreePlates = async () => {
    try {
      const res = await fetch(`/api/reservations/list.php?free=1&user_id=${user.user_id}`);
      const data = await res.json();
      if (data.success) {
        setFreePlates(data.reservations);
      } else {
        setMessage("Failed to load plates");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching plates");
    }
  };

  const toggleSelect = (reservation_id) => {
    if (selectedPlates.includes(reservation_id)) {
      setSelectedPlates(selectedPlates.filter(id => id !== reservation_id));
    } else {
      if (selectedPlates.length < 2) {
        setSelectedPlates([...selectedPlates, reservation_id]);
      } else {
        alert("You can only select up to 2 plates.");
      }
    }
  };

  const handleCheckout = async () => {
    if (selectedPlates.length === 0) {
      alert("Select at least one plate to checkout");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reservations/checkout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          reservation_ids: selectedPlates
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Checkout successful!");
        setSelectedPlates([]);
        fetchFreePlates(); // refresh list
      } else {
        setMessage("Checkout failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error during checkout");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Needy Dashboard</h2>
      {message && <p>{message}</p>}
      <h3>Available Free Plates</h3>
      {freePlates.length === 0 ? (
        <p>No free plates available right now.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {freePlates.map((resv) => (
            <li key={resv.reservation_id} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
              <input
                type="checkbox"
                checked={selectedPlates.includes(resv.reservation_id)}
                onChange={() => toggleSelect(resv.reservation_id)}
              />
              <strong> {resv.plate_name} </strong> - {resv.description} 
              <span style={{ marginLeft: "10px" }}>Qty: {resv.qty}</span>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleCheckout} disabled={loading} style={{ marginTop: "10px", padding: "10px 20px" }}>
        {loading ? "Processing..." : "Checkout Selected Plates"}
      </button>
    </div>
  );
};

export default NeedyDashboard;
