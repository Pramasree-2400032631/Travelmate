import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {id, name, email, role}

  // Load active session
  useEffect(() => {
    const saved = localStorage.getItem("tm_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // LOGIN - throws on failure
  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("tm_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Invalid credentials");
    }
    const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    setUser(sessionUser);
    localStorage.setItem("tm_user", JSON.stringify(sessionUser));
    return sessionUser;
  }

  // REGISTER - throws if email exists
  function register(name, email, password, role = "host") {
    const users = JSON.parse(localStorage.getItem("tm_users") || "[]");
    if (users.some((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser = { id: Date.now(), name, email, password, role };
    const updated = [...users, newUser];
    localStorage.setItem("tm_users", JSON.stringify(updated));
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    setUser(sessionUser);
    localStorage.setItem("tm_user", JSON.stringify(sessionUser));
    return sessionUser;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("tm_user");
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}