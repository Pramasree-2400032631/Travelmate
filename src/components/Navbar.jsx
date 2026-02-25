import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <nav style={navStyle}>
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        ✈ Travel Mate
      </h2>

      <div>
        {!user ? (
          <>
            <button onClick={() => navigate("/login")} style={btn}>
              Login
            </button>
            <button onClick={() => navigate("/register")} style={btn}>
              Register
            </button>
          </>
        ) : (
          <>
            <span style={{ marginRight: "15px" }}>
              Welcome, {user.name}
            </span>
            <button onClick={handleLogout} style={btn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 40px",
  background: "#f3f4f6",
  alignItems: "center"
};

const btn = {
  padding: "8px 16px",
  marginLeft: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};