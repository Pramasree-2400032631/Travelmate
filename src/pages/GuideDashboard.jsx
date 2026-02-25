// src/pages/GuideDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/GuideDashboard.css";
/**
 * GuideDashboard — feature rich guide portal.
 *
 * LocalStorage keys:
 * - tm_tours: [{id, guideId, title, description, price, capacity, meetingPoint, dates:[], availableDates:[], bookingsCount}]
 * - tm_bookings: [{id, itemType:'tour', itemId, guideId, userName, amount, status, start}]
 * - tm_messages: [{id, guideId, from, text, reply, date}]
 *
 * This is a standalone, copy-paste-ready file. No extra components required.
 */

export default function GuideDashboard() {
  const { user, logout } = useAuth(); // user must exist (protected route)
  const guideId = user?.id;

  // Local storage keys
  const KEY_TOURS = "tm_tours";
  const KEY_BOOKINGS = "tm_bookings";
  const KEY_MESSAGES = "tm_messages";

  // state
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  // form state for tour create/edit
  const initialForm = {
    id: null,
    title: "",
    description: "",
    price: "",
    capacity: "",
    meetingPoint: "",
    datesText: "", // comma-separated
  };
  const [form, setForm] = useState(initialForm);

  // UI state
  const [tab, setTab] = useState("overview"); // overview | tours | bookings | messages | profile
  const [filter, setFilter] = useState("");
  const [selectedTour, setSelectedTour] = useState(null);
  const [availabilityDate, setAvailabilityDate] = useState("");

  // profile edit (basic)
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });

  // load data
  useEffect(() => {
    const allTours = JSON.parse(localStorage.getItem(KEY_TOURS) || "[]");
    setTours(allTours.filter((t) => t.guideId === guideId));

    const allBookings = JSON.parse(localStorage.getItem(KEY_BOOKINGS) || "[]");
    setBookings(allBookings.filter((b) => b.guideId === guideId));

    const allMessages = JSON.parse(localStorage.getItem(KEY_MESSAGES) || "[]");
    setMessages(allMessages.filter((m) => m.guideId === guideId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideId]);

  // helpers: persist
  function persistTours(updatedForThisGuide) {
    const all = JSON.parse(localStorage.getItem(KEY_TOURS) || "[]");
    const others = all.filter((t) => t.guideId !== guideId);
    const updatedAll = [...others, ...updatedForThisGuide];
    localStorage.setItem(KEY_TOURS, JSON.stringify(updatedAll));
    setTours(updatedForThisGuide);
  }

  function persistBookings(updatedForThisGuide) {
    const all = JSON.parse(localStorage.getItem(KEY_BOOKINGS) || "[]");
    const others = all.filter((b) => b.guideId !== guideId);
    const updatedAll = [...others, ...updatedForThisGuide];
    localStorage.setItem(KEY_BOOKINGS, JSON.stringify(updatedAll));
    setBookings(updatedForThisGuide);
  }

  function persistMessages(updatedForThisGuide) {
    const all = JSON.parse(localStorage.getItem(KEY_MESSAGES) || "[]");
    const others = all.filter((m) => m.guideId !== guideId);
    const updatedAll = [...others, ...updatedForThisGuide];
    localStorage.setItem(KEY_MESSAGES, JSON.stringify(updatedAll));
    setMessages(updatedForThisGuide);
  }

  // Stats
  const stats = {
    toursCount: tours.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + (b.amount || 0), 0),
  };

  // ---- Tour CRUD ----
  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(tour) {
    setForm({
      id: tour.id,
      title: tour.title,
      description: tour.description || "",
      price: tour.price,
      capacity: tour.capacity || "",
      meetingPoint: tour.meetingPoint || "",
      datesText: (tour.dates || []).join(","),
    });
    setTab("tours");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setForm(initialForm);
    setSelectedTour(null);
  }

  function saveTour(e) {
    e && e.preventDefault();
    // basic validation
    if (!form.title || !form.price) {
      alert("Please enter at least a title and price.");
      return;
    }

    const parsedDates = form.datesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const existing = [...tours];
    if (form.id) {
      // update
      const idx = existing.findIndex((t) => t.id === form.id);
      if (idx >= 0) {
        existing[idx] = {
          ...existing[idx],
          title: form.title,
          description: form.description,
          price: Number(form.price),
          capacity: Number(form.capacity || 0),
          meetingPoint: form.meetingPoint,
          dates: parsedDates,
        };
      }
    } else {
      const newTour = {
        id: Date.now(),
        guideId,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        capacity: Number(form.capacity || 0),
        meetingPoint: form.meetingPoint,
        dates: parsedDates,
        availableDates: parsedDates.slice(),
        bookingsCount: 0,
      };
      existing.push(newTour);
    }

    persistTours(existing);
    setForm(initialForm);
    alert("Tour saved.");
  }

  function deleteTour(id) {
    if (!confirm("Delete this tour?")) return;
    const remaining = tours.filter((t) => t.id !== id);
    // also remove related bookings
    const allBookings = JSON.parse(localStorage.getItem(KEY_BOOKINGS) || "[]").filter(
      (b) => !(b.guideId === guideId && b.itemType === "tour" && b.itemId === id)
    );
    localStorage.setItem(KEY_BOOKINGS, JSON.stringify(allBookings));
    persistTours(remaining);
    setBookings(allBookings.filter((b) => b.guideId === guideId));
  }

  // ---- Availability ----
  function addAvailability(tourId) {
    if (!availabilityDate) return;
    const updated = tours.map((t) =>
      t.id === tourId ? { ...t, availableDates: Array.from(new Set([...(t.availableDates || []), availabilityDate])) } : t
    );
    persistTours(updated);
    setAvailabilityDate("");
  }

  function removeAvailability(tourId, date) {
    const updated = tours.map((t) => (t.id === tourId ? { ...t, availableDates: (t.availableDates || []).filter((d) => d !== date) } : t));
    persistTours(updated);
  }

  // ---- Bookings management ----
  function confirmBooking(id) {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b));
    persistBookings(updated);
    alert("Booking confirmed.");
  }

  function rejectBooking(id) {
    if (!confirm("Reject this booking?")) return;
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: "rejected" } : b));
    persistBookings(updated);
  }

  // ---- Messages area ----
  function sendReply(messageId, replyText) {
    const updated = messages.map((m) => (m.id === messageId ? { ...m, reply: replyText, repliedAt: new Date().toISOString() } : m));
    persistMessages(updated);
    alert("Reply saved.");
  }

  function sendMessageFromVisitor(tourId) {
    // demo helper to create a message from a visitor -> guide
    const all = JSON.parse(localStorage.getItem(KEY_MESSAGES) || "[]");
    const sample = {
      id: Date.now(),
      guideId,
      from: "Demo Traveller",
      text: `Is the tour ${tours.find((t) => t.id === tourId)?.title || "this tour"} available next month?`,
      date: new Date().toISOString(),
      reply: "",
    };
    all.push(sample);
    localStorage.setItem(KEY_MESSAGES, JSON.stringify(all));
    setMessages(all.filter((m) => m.guideId === guideId));
    setTab("messages");
    alert("Demo message created.");
  }

  // ---- Profile update (persists in tm_users localStorage) ----
  function saveProfile() {
    const all = JSON.parse(localStorage.getItem("tm_users") || "[]");
    const idx = all.findIndex((u) => u.id === guideId);
    if (idx >= 0) {
      all[idx] = { ...all[idx], name: profile.name, email: profile.email };
      localStorage.setItem("tm_users", JSON.stringify(all));
      alert("Profile saved (localStorage).");
    } else {
      alert("User not found in localStorage.");
    }
  }

  // ---- Export / Import tours for this guide ----
  function exportTours() {
    const data = tours;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guide-${guideId}-tours.json`;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importTours(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error("Invalid file");
        // attach guideId and push
        const all = JSON.parse(localStorage.getItem(KEY_TOURS) || "[]");
        const prepared = imported.map((t) => ({ ...t, id: Date.now() + Math.floor(Math.random() * 10000), guideId }));
        const merged = [...all, ...prepared];
        localStorage.setItem(KEY_TOURS, JSON.stringify(merged));
        setTours(merged.filter((x) => x.guideId === guideId));
        alert("Imported tours.");
      } catch (err) {
        alert("Failed to import: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  // ---- Filtered tours view ----
  const visibleTours = tours.filter((t) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return (t.title || "").toLowerCase().includes(q) || (t.meetingPoint || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q);
  });

  // ---- Render ----
  return (
  <main className="guide-dashboard">
      <header className="guide-header">
        <div>
          <h1 style={{ margin: 0 }}>Host / Guide Dashboard</h1>
          <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>Manage your tours, bookings, availability and messages.</p>
          <p style={{ margin: "6px 0 0 0", fontSize: 13, color: "#94a3b8" }}>Hi, {profile.name || "Guide"}</p>
        </div>

        <div className="guide-tabs">
          <button className="btn-secondary" onClick={() => setTab("overview")}>Overview</button>
          <button className="btn-secondary" onClick={() => setTab("tours")}>Tours</button>
          <button className="btn-secondary" onClick={() => setTab("bookings")}>Bookings</button>
          <button className="btn-secondary" onClick={() => setTab("messages")}>Messages</button>
        </div>
      </header>

      {/* Overview */}
      {tab === "overview" && (
        <>
          <section className="stats-grid">
            <div className="dashboard-card">
              <p style={{ color: "#64748b", marginBottom: 6 }}>My Tours</p>
              <h3 style={{ margin: 0 }}>{stats.toursCount}</h3>
            </div>
            <div className="dashboard-card">
              <p style={{ color: "#64748b", marginBottom: 6 }}>Pending Bookings</p>
              <h3 style={{ margin: 0 }}>{stats.pendingBookings}</h3>
            </div>
            <div className="dashboard-card">
              <p style={{ color: "#64748b", marginBottom: 6 }}>Confirmed Bookings</p>
              <h3 style={{ margin: 0 }}>{stats.confirmedBookings}</h3>
            </div>
            <div className="dashboard-card">
              <p style={{ color: "#64748b", marginBottom: 6 }}>Revenue (approx)</p>
              <h3 style={{ margin: 0 }}>{`₹${stats.revenue}`}</h3>
            </div>
          </section>

          <section style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h3>Your listings</h3>
                <div style={{ marginTop: 8 }}>
                  {tours.length === 0 && <p style={{ color: "#64748b" }}>No tours yet.</p>}
                  {tours.slice(0, 6).map((t) => (
                    <div key={t.id} className="tour-row">
                      <div>
                        <strong>{t.title}</strong>
                        <div style={{ color: "#6b7280", fontSize: 13 }}>{t.meetingPoint} — {t.dates?.join(", ") || "No dates"}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-sm" onClick={() => startEdit(t)}>Edit</button>
                        <button className="btn-sm" onClick={() => sendMessageFromVisitor(t.id)}>Demo Msg</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ width: 320 }}>
                <div className="card">
                  <h4 style={{ marginTop: 0 }}>Quick Actions</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button onClick={() => setTab("tours")} className="btn-primary">Add / Manage Tours</button>
                    <button onClick={() => { exportTours(); alert("Downloaded tours for backup."); }} className="btn-secondary">Export my tours</button>
                    <label style={{ display: "block", marginTop: 6 }}>
                      Import tours (JSON)
                      <input type="file" accept="application/json" onChange={(e) => e.target.files[0] && importTours(e.target.files[0])} />
                    </label>
                    <button onClick={() => { alert("Availability is visible to travellers when they request."); }} className="btn-secondary">How availability works</button>
                  </div>
                </div>

                <div className="card" style={{ marginTop: 10 }}>
                  <h4 style={{ marginTop: 0 }}>Messages</h4>
                  <p style={{ marginTop: 6, color: "#64748b" }}>Unread: {messages.filter((m) => !m.reply).length}</p>
                  <button className="btn-sm" onClick={() => setTab("messages")}>Open Messages</button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Tours tab */}
      {tab === "tours" && (
        <section style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h2>Manage Tours</h2>
              <div style={{ marginBottom: 8 }}>
                <input placeholder="Filter tours..." value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e6edf3" }} />
              </div>

              {visibleTours.length === 0 && <p style={{ color: "#64748b" }}>No tours found.</p>}

              {visibleTours.map((t) => (
                <div key={t.id} className="card" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{t.title}</h3>
                      <p style={{ margin: "6px 0 0 0", color: "#6b7280" }}>{t.description}</p>
                      <p style={{ margin: "6px 0 0 0" }}>Price: ₹{t.price} • Capacity: {t.capacity || "—"}</p>
                      <p style={{ margin: "6px 0 0 0", color: "#94a3b8" }}>Meeting point: {t.meetingPoint || "—"}</p>

                      <div style={{ marginTop: 8 }}>
                        <strong>Available dates:</strong>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                          {(t.availableDates || []).map((d) => (
                            <span key={d} style={{ padding: "6px 8px", borderRadius: 6, background: "#eef2ff", fontSize: 13 }}>
                              {d} <button className="btn-sm" onClick={() => removeAvailability(t.id, d)} style={{ marginLeft: 6 }}>x</button>
                            </span>
                          ))}
                          <div style={{ marginLeft: 6 }}>
                            <input type="date" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)} />
                            <button className="btn-sm" onClick={() => addAvailability(t.id)} style={{ marginLeft: 6 }}>Add</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button className="btn-primary" onClick={() => startEdit(t)}>Edit</button>
                      <button className="btn-sm" onClick={() => { createSampleBookingForTour(t); alert("Created demo booking (pending)."); }}>Create demo booking</button>
                      <button className="btn-danger" onClick={() => deleteTour(t.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside style={{ width: 360 }}>
              <div className="card">
                <h3>{form.id ? "Edit Tour" : "Create Tour"}</h3>
                <form onSubmit={saveTour}>
                  <label>
                    Title
                    <input name="title" value={form.title} onChange={handleFormChange} />
                  </label>
                  <label>
                    Description
                    <input name="description" value={form.description} onChange={handleFormChange} />
                  </label>
                  <label>
                    Price (₹)
                    <input name="price" type="number" value={form.price} onChange={handleFormChange} />
                  </label>
                  <label>
                    Capacity
                    <input name="capacity" type="number" value={form.capacity} onChange={handleFormChange} />
                  </label>
                  <label>
                    Meeting Point
                    <input name="meetingPoint" value={form.meetingPoint} onChange={handleFormChange} />
                  </label>
                  <label>
                    Dates (comma separated YYYY-MM-DD)
                    <input name="datesText" value={form.datesText} onChange={handleFormChange} placeholder="2025-12-20,2025-12-27" />
                  </label>

                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button type="submit" className="btn-primary">{form.id ? "Save changes" : "Create tour"}</button>
                    <button type="button" className="btn-secondary" onClick={() => { setForm(initialForm); }}>Clear</button>
                  </div>
                </form>
              </div>

              <div className="card" style={{ marginTop: 10 }}>
                <h4>Import / Export</h4>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-secondary" onClick={exportTours}>Export my tours</button>
                  <label style={{ display: "inline-block" }}>
                    <input type="file" accept="application/json" onChange={(e) => e.target.files[0] && importTours(e.target.files[0])} />
                  </label>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* Bookings tab */}
      {tab === "bookings" && (
        <section style={{ marginTop: 14 }}>
          <h2>Bookings</h2>
          {bookings.length === 0 && <p style={{ color: "#64748b" }}>No bookings yet.</p>}
          {bookings.map((b) => (
            <div key={b.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>{b.tourName || (tours.find((t) => t.id === b.itemId)?.title || "Tour")}</strong>
                  <div style={{ color: "#6b7280" }}>{b.userName} • {b.start}</div>
                  <div style={{ marginTop: 6 }}>Amount: ₹{b.amount}</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {b.status === "pending" && <button className="btn-primary" onClick={() => confirmBooking(b.id)}>Confirm</button>}
                  {b.status === "pending" && <button className="btn-danger" onClick={() => rejectBooking(b.id)}>Reject</button>}
                  <div style={{ color: b.status === "confirmed" ? "#059669" : "#ef4444", fontWeight: 700 }}>{b.status}</div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Messages tab */}
      {tab === "messages" && (
        <section style={{ marginTop: 14 }}>
          <h2>Messages & Requests</h2>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              {messages.length === 0 && <p style={{ color: "#64748b" }}>No messages yet.</p>}
              {messages.map((m) => (
                <div key={m.id} className="card" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <strong>{m.from}</strong>
                      <div style={{ color: "#6b7280" }}>{new Date(m.date).toLocaleString()}</div>
                      <p style={{ marginTop: 8 }}>{m.text}</p>
                      {m.reply && <div style={{ marginTop: 8, color: "#059669" }}><strong>Your reply:</strong> {m.reply}</div>}
                    </div>

                    <div style={{ minWidth: 180 }}>
                      <ReplyBox message={m} onReply={(reply) => sendReply(m.id, reply)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside style={{ width: 320 }}>
              <div className="card">
                <h4>Send Announcement</h4>
                <p style={{ color: "#64748b" }}>This will create a demo message for each tour (for local testing).</p>
                <button className="btn-primary" onClick={() => { tours.forEach((t) => sendMessageFromVisitor(t.id)); }}>Create demo messages</button>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* Profile tab */}
      {tab === "profile" && (
        <section style={{ marginTop: 14 }}>
          <h2>Profile</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label>
                Name
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </label>

              <label>
                Email
                <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </label>

              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button className="btn-primary" onClick={saveProfile}>Save profile</button>
                <button className="btn-secondary" onClick={() => { setProfile({ name: user.name, email: user.email }); }}>Reset</button>
              </div>
            </div>

            <aside style={{ width: 320 }}>
              <div className="card">
                <h4>Quick Overview</h4>
                <p style={{ margin: 0, color: "#64748b" }}>Name: {profile.name}</p>
                <p style={{ margin: 0, color: "#64748b" }}>Email: {profile.email}</p>
                <p style={{ marginTop: 8, color: "#94a3b8" }}>Tip: update your profile so travellers can contact you.</p>
              </div>
            </aside>
          </div>
        </section>
      )}
    </main>
  );

  // helper - create sample booking for a tour (demo)
  function createSampleBookingForTour(tour) {
    const all = JSON.parse(localStorage.getItem(KEY_BOOKINGS) || "[]");
    const b = {
      id: Date.now(),
      itemType: "tour",
      itemId: tour.id,
      guideId,
      tourName: tour.title,
      userName: "Demo Traveller",
      amount: tour.price,
      start: tour.dates?.[0] || new Date().toISOString().slice(0, 10),
      status: "pending",
    };
    all.push(b);
    localStorage.setItem(KEY_BOOKINGS, JSON.stringify(all));
    setBookings(all.filter((bb) => bb.guideId === guideId));
  }

  // helper - confirm and reject wrappers referenced above
  function confirmBooking(id) {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b));
    persistBookings(updated);
    alert("Booking confirmed.");
  }
  function rejectBooking(id) {
    if (!confirm("Reject this booking?")) return;
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: "rejected" } : b));
    persistBookings(updated);
  }

  // reply save used in Message tab
  function sendReply(messageId, replyText) {
    const updated = messages.map((m) => (m.id === messageId ? { ...m, reply: replyText, repliedAt: new Date().toISOString() } : m));
    persistMessages(updated);
    alert("Reply saved.");
  }

  // demo create message helper (already used above)
  function sendMessageFromVisitor(tourId) {
    const all = JSON.parse(localStorage.getItem(KEY_MESSAGES) || "[]");
    const sample = {
      id: Date.now(),
      guideId,
      from: "Demo Traveller",
      text: `Is "${tours.find((t) => t.id === tourId)?.title || "this tour"}" available on weekends?`,
      date: new Date().toISOString(),
      reply: "",
    };
    all.push(sample);
    localStorage.setItem(KEY_MESSAGES, JSON.stringify(all));
    setMessages(all.filter((m) => m.guideId === guideId));
  }

  // export / import functions
  function exportTours() {
    const data = tours;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guide-${guideId}-tours.json`;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function importTours(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error("Invalid file");
        const all = JSON.parse(localStorage.getItem(KEY_TOURS) || "[]");
        const prepared = imported.map((t) => ({ ...t, id: Date.now() + Math.floor(Math.random() * 10000), guideId }));
        const merged = [...all, ...prepared];
        localStorage.setItem(KEY_TOURS, JSON.stringify(merged));
        setTours(merged.filter((x) => x.guideId === guideId));
        alert("Imported tours.");
      } catch (err) {
        alert("Failed to import: " + err.message);
      }
    };
    reader.readAsText(file);
  }
}

// small reply box component for messages
function ReplyBox({ message, onReply }) {
  const [text, setText] = useState(message.reply || "");
  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} style={{ width: "100%", padding: 8, borderRadius: 8 }} />
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button className="btn-primary btn-sm" onClick={() => onReply(text)}>Send reply</button>
        <button className="btn-secondary btn-sm" onClick={() => { setText(""); }}>Clear</button>
      </div>
    </div>
  );
}