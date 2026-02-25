import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 onClick={() => navigate("/")}>✈ Travel Mate</h2>
      </div>

      {user && (
        <div className="navbar-right">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}