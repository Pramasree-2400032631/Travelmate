import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";
import travelImg from "../assets/images/travel.jpg";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tourist"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.name) newErrors.name = "Name required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.password) newErrors.password = "Password required";

    const users = JSON.parse(localStorage.getItem("tm_users")) || [];

    const exists = users.find(
      (u) => u.email === formData.email
    );

    if (exists) {
      newErrors.email = "User already exists";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    users.push(newUser);
    localStorage.setItem("tm_users", JSON.stringify(users));

    navigate("/login");
  };

  return (
    <div className="auth-container">

      {/* LEFT IMAGE */}
      <div
        className="auth-left"
        style={{ backgroundImage: `url(${travelImg})` }}
      ></div>

      {/* RIGHT FORM */}
      <div className="auth-right">
        <div className="auth-card">

          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <select name="role" onChange={handleChange}>
              <option value="tourist">Tourist</option>
              <option value="guide">Guide</option>
              <option value="host">Host</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className="auth-btn-main">
              Register
            </button>

          </form>

          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

        </div>
      </div>

    </div>
  );
}