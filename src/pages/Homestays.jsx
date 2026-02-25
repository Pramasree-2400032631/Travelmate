import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Homestays.css";

export default function Homestays() {
  const location = useLocation();
  const navigate = useNavigate();

  const place = location.state?.place || "Selected Place";

  const homestays = [
    {
      name: "Green Valley Stay",
      price: 2000,
      sellerName: "Ramesh Sharma",
      sellerPhone: "9876543210",
      sellerAddress: "MG Road, City Center",
      img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
    },
    {
      name: "Luxury Hill View",
      price: 3500,
      sellerName: "Anita Verma",
      sellerPhone: "9123456780",
      sellerAddress: "Hill Top Area",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
    },
    {
      name: "Royal Heritage Stay",
      price: 5000,
      sellerName: "Vikram Singh",
      sellerPhone: "9988776655",
      sellerAddress: "Old Town Road",
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
    },
    {
      name: "Cozy Cottage",
      price: 1800,
      sellerName: "Meera Patel",
      sellerPhone: "9090909090",
      sellerAddress: "Lake View Street",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
    },
    {
      name: "Beach Paradise Villa",
      price: 4000,
      sellerName: "Rahul Nair",
      sellerPhone: "9871234567",
      sellerAddress: "Beachside Avenue",
      img: "https://images.unsplash.com/photo-1501183638710-841dd1904471"
    }
  ];

  const [nights, setNights] = useState(1);
  const [selectedStay, setSelectedStay] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleProceed = () => {
    if (!customerName || !customerPhone) {
      alert("Please fill your details");
      return;
    }

    navigate("/payment", {
      state: {
        stay: selectedStay.name,
        total: selectedStay.price * nights,
        customerName,
        customerPhone,
        sellerName: selectedStay.sellerName,
        sellerPhone: selectedStay.sellerPhone,
        sellerAddress: selectedStay.sellerAddress
      }
    });
  };

  return (
    <div className="homestay-hero">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>🏡 Homestays in {place}</h1>

      <div className="homestay-grid">
        {homestays.map((stay, index) => (
          <div key={index} className="homestay-card">
            <img src={stay.img} alt={stay.name} />
            <h3>{stay.name}</h3>
            <p>₹ {stay.price} per night</p>

            <input
              type="number"
              min="1"
              value={nights}
              onChange={(e) => setNights(e.target.value)}
            />

            <h4>Total: ₹ {stay.price * nights}</h4>

            <button
              className="book-btn"
              onClick={() => setSelectedStay(stay)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {selectedStay && (
        <div className="booking-form">
          <h2>Enter Your Details</h2>

          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Your Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          <hr style={{ margin: "20px 0" }} />

          <h3>Seller Details</h3>
          <p><strong>Name:</strong> {selectedStay.sellerName}</p>
          <p><strong>Phone:</strong> {selectedStay.sellerPhone}</p>
          <p><strong>Address:</strong> {selectedStay.sellerAddress}</p>

          <button className="proceed-btn" onClick={handleProceed}>
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
}