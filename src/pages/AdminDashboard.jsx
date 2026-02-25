import { useEffect, useState } from "react";
import "../css/AdminDashboard.css";

export default function AdminDashboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers =
      JSON.parse(localStorage.getItem("tm_users")) || [];
    setUsers(savedUsers);
  };

  const changeRole = (id, newRole) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, role: newRole } : u
    );

    setUsers(updated);
    localStorage.setItem("tm_users", JSON.stringify(updated));
  };

  const removeUser = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem("tm_users", JSON.stringify(updated));
  };

  return (
    <main className="admin-container">

      <h1>Admin Dashboard</h1>
      <p>Platform stats and user management.</p>

      {/* Stats */}
      <div className="admin-stats">
        <StatCard title="Users" value={users.length} />
      </div>

      {/* Users Table */}
      <section className="admin-section">
        <h2>Users</h2>

        {users.length === 0 && <p>No users found.</p>}

        <div className="user-table">

          <div className="user-header">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Actions</span>
          </div>

          {users.map((user) => (
            <div key={user.id} className="user-row">
              <span>{user.name}</span>
              <span>{user.email}</span>

              <select
                value={user.role}
                onChange={(e) =>
                  changeRole(user.id, e.target.value)
                }
              >
                <option value="admin">Admin</option>
                <option value="host">Host</option>
                <option value="guide">Guide</option>
                <option value="tourist">Tourist</option>
              </select>

              <button
                className="remove-btn"
                onClick={() => removeUser(user.id)}
              >
                Remove
              </button>
            </div>
          ))}

        </div>
      </section>

    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="admin-stat-card">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}