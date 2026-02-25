import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const KEY = "tm_reviews";

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
    setReviews(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(reviews));
  }, [reviews]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const newReview = {
      id: Date.now(),
      user: user.name,
      rating,
      text,
    };
    setReviews((prev) => [newReview, ...prev]);
    setText("");
    setRating(5);
  }

  return (
    <section>
      <h2>User Reviews & Ratings</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label>
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label>
          Your experience
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <button type="submit" style={{ marginTop: "0.5rem" }}>
          Submit Review
        </button>
      </form>

      <h3 style={{ marginTop: "1rem" }}>Recent Reviews</h3>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      <ul>
        {reviews.map((r) => (
          <li key={r.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{r.user}</strong> – {r.rating}★
            <br />
            {r.text}
          </li>
        ))}
      </ul>
    </section>
  );
}