// src/pages/HostDashboard.jsx
import React, { useEffect, useState } from "react";
import "../css/HostDashboard.css";

export default function HostDashboard() {
  const [homestays, setHomestays] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    location: "",
    price: "",
    facilities: "",
    image: ""
  });

  useEffect(() => {
    const savedHomes =
      JSON.parse(localStorage.getItem("host_homestays")) || [];
    const savedBookings =
      JSON.parse(localStorage.getItem("host_bookings")) || [];

    setHomestays(savedHomes);
    setBookings(savedBookings);
  }, []);

  // ================= ADD / UPDATE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOrUpdateHomestay = () => {
    if (!form.name || !form.location || !form.price) return;

    let updated;

    if (form.id) {
      updated = homestays.map((h) =>
        h.id === form.id ? form : h
      );
    } else {
      updated = [...homestays, { ...form, id: Date.now() }];
    }

    setHomestays(updated);
    localStorage.setItem("host_homestays", JSON.stringify(updated));

    setForm({
      id: null,
      name: "",
      location: "",
      price: "",
      facilities: "",
      image: ""
    });
  };

  const editHomestay = (home) => {
    setForm(home);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteHomestay = (id) => {
    const updated = homestays.filter((h) => h.id !== id);
    setHomestays(updated);
    localStorage.setItem("host_homestays", JSON.stringify(updated));
  };

  // ================= DEMO BOOKING =================
  const createDemoBooking = (home) => {
    const newBooking = {
      id: Date.now(),
      homestayId: home.id,
      homestayName: home.name,
      guest: "Demo Guest",
      amount: Number(home.price),
      status: "pending"
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem("host_bookings", JSON.stringify(updatedBookings));
  };

  const confirmBooking = (id) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "confirmed" } : b
    );

    setBookings(updated);
    localStorage.setItem("host_bookings", JSON.stringify(updated));
  };

  // ================= STATS =================
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed"
  );

  const earnings = confirmedBookings.reduce(
    (sum, b) => sum + b.amount,
    0
  );

  return (
    <main className="host-container">

      <h1>Homestay Host Dashboard</h1>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard title="Total Homestays" value={homestays.length} />
        <StatCard title="Bookings" value={bookings.length} />
        <StatCard title="Confirmed" value={confirmedBookings.length} />
        <StatCard title="Earnings" value={`₹${earnings}`} />
      </div>

      {/* ADD FORM */}
      <section className="card-section">
        <h2>Add New Homestay</h2>

        <div className="form-grid">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <input name="price" placeholder="Price per night" value={form.price} onChange={handleChange} />
          <input name="facilities" placeholder="Facilities" value={form.facilities} onChange={handleChange} />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        </div>

        <button className="primary-btn" onClick={addOrUpdateHomestay}>
          {form.id ? "Update Homestay" : "Add Homestay"}
        </button>
      </section>

      {/* MY HOMESTAYS */}
      <section className="card-section">
        <h2>My Homestays</h2>

        {homestays.length === 0 && <p>No homestays added yet.</p>}

        <div className="homestay-grid">
          {homestays.map((home) => (
            <div key={home.id} className="homestay-card">

              {home.image && (
                <img src={home.image} alt={home.name} />
              )}

              <div className="homestay-info">
                <h3>{home.name}</h3>
                <p>{home.location}</p>
                <p>₹{home.price} / night</p>
                <span>{home.facilities}</span>

                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => editHomestay(home)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteHomestay(home.id)}>Delete</button>
                  <button className="demo-btn" onClick={() => createDemoBooking(home)}>Demo Booking</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* BOOKINGS */}
      <section className="card-section">
        <h2>Homestay Bookings</h2>

        {bookings.length === 0 && <p>No bookings yet.</p>}

        {bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <div>
              <strong>{b.homestayName}</strong>
              <p>{b.guest}</p>
              <p>₹{b.amount}</p>
            </div>

            <div>
              {b.status === "pending" && (
                <button className="confirm-btn" onClick={() => confirmBooking(b.id)}>
                  Confirm
                </button>
              )}
              <span className={b.status}>{b.status}</span>
            </div>
          </div>
        ))}
      </section>

    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}