import { useLocation } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const {
    stay,
    total,
    customerName,
    customerPhone,
    sellerName,
    sellerPhone,
    sellerAddress
  } = location.state || {};

  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h1>💳 Payment Details</h1>

      <h3>Customer Details</h3>
      <p><strong>Name:</strong> {customerName}</p>
      <p><strong>Phone:</strong> {customerPhone}</p>

      <hr />

      <h3>Seller Details</h3>
      <p><strong>Name:</strong> {sellerName}</p>
      <p><strong>Phone:</strong> {sellerPhone}</p>
      <p><strong>Address:</strong> {sellerAddress}</p>

      <hr />

      <h2>Stay: {stay}</h2>
      <h2>Total Amount: ₹ {total}</h2>

      <button
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
        onClick={() => alert("Payment Successful ✅")}
      >
        Pay Now
      </button>
    </div>
  );
}