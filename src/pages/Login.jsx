import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";
import travelImg from "../assets/images/travel.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 FIXED: use tm_users instead of users
    const users = JSON.parse(localStorage.getItem("tm_users")) || [];

    const user = users.find(
      (u) =>
        u.email === formData.email &&
        u.password === formData.password
    );

    if (!user) return alert("Invalid credentials");

    localStorage.setItem("currentUser", JSON.stringify(user));

    // Role based redirect
    if (user.role === "tourist") navigate("/dashboard");
    if (user.role === "admin") navigate("/dashboard/admin");
    if (user.role === "guide") navigate("/dashboard/guide");
    if (user.role === "host") navigate("/dashboard/host");
  };

  return (
    <div className="auth-container">
      <div
        className="auth-left"
        style={{ backgroundImage: `url(${travelImg})` }}
      ></div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <button className="auth-btn-main">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}